$.fn.roadrunner = function(data){
    var rr = this;
    this.init = function(rr_data){
        rr.Globals = $.extend(rr.Globals, rr_data);
        rr.Globals.input = $('[name="' + rr.Globals.tree_name + '"]#' + rr.attr('id'));
        rr.Globals.form = rr.closest('form');
        rr.Gui.deviceViewSelect();
        rr.Gui.setupEditor();
        rr.Content.addContent('', '');
        rr.Globals.input.val(JSON.stringify(rr.Globals.stream_data));
        rr.Dragging.sortable(rr.find('.rr_items'), {
            items: '> .rr_blockwrapper, > .rr_structblock',
        });
        rr.Events.setupEvents();
        rr.Events.setupSaveEvents();
        console.log(rr.Globals.art);
    };

    rr.Actions = (function(){

        var addChild = function(treePath, source){
            var block = rr.Routing.getData(treePath, rr.Globals.tree);
            var dataPath = source.closest('[data-path]').attr('data-path');
            if (typeof dataPath == 'undefined') {
                dataPath = '';
            }
            if(block.type == 'StreamBlock'){
                rr.Gui.addBlockPicker(block.children, treePath, dataPath);
            } else if (block.type == 'ListBlock'){
                rr.Gui.openForm(block.children, treePath, dataPath, 'validateForm');
            }
        };

        var editBlock = function(value, source){
            var dataPath = source.closest('.stream-menu-inner').attr('data-path');
            var current_data = rr.Routing.getData(dataPath, rr.Globals.stream_data);
            current_data['type'] = value;
            rr.Gui.hideModal();

            if (value.endsWith('_width')) {
                var newIndex = rr.Content.findNodeIndex(value, rr.Globals.tree.children);
                var block = rr.Globals.tree.children[newIndex];
                var label = '<span class="icon icon-' + block.icon + '"></span> ' + block.label;
                var query = '.rr_blockwrapper[data-path="' + dataPath + '"]';
                var element = rr.find(query);
                element.removeClass('fixed_width').removeClass('full_width').addClass(value)
                .find('.rr_header_label:first').html(label);

                // Update treepath of all children, probably not even needed..
                var path = element.attr('data-treepath');
                var splitted = rr.Routing.stringToPath(path);
                splitted[1] = newIndex;
                var newPath = rr.Routing.pathToString(splitted) + '/';
                var elementsWithPath = $(query + ',' + query + ' [data-treepath^="' + path + '"]' + ',' + query + ' [data-params^="' + path + '"]');

                elementsWithPath.each(function(i, item){
                    var attr = 'data-treepath';
                    if (!item.getAttribute(attr)) {
                        attr = 'data-params';
                    }
                    var itemPath = item.getAttribute(attr);
                    var newItemPath = itemPath.replace(path, newPath);
                    $(item).attr(attr, newItemPath);
                });

            }
        };

        var buttonTexts = [
            'Probeer opnieuw',
            'Opslaan',
            'OK',
            'Gewoon gaan',
            'Valideer',
            'Pas toe',
        ];

        var groupByName = function(obj) {
            var newObj = [];
            for (var i in obj) {
                var o = obj[i];
                var index = rr.Content.findNodeIndex(o.name, newObj);
                if (!index) {
                    newObj.push(o);
                } else {
                    var entry = newObj[index];
                    var isArray = rr.Helpers.isArray(entry.value);
                    if (isArray) {
                        entry.value.push(o.value);
                    } else {
                        entry.value = [entry.value, o.value];
                    }
                }
            }
            return newObj;
        };

        var validateForm = function(treePath, source) {
            var block = rr.Routing.getData(treePath, rr.Globals.tree);
            var fields = rr.Globals.modal.find('[name]');
            var validated = rr.Validation.validate(fields);

            source.addClass('button-longrunning-active');
            source.attr('disabled', 'disabled');

            if (validated) {
                var serialized_data = groupByName(fields.serializeArray());
                var dataPath = source.attr('data-path');
                var tmp_obj = {};

                if (block.type == 'ListBlock') {
                    dataPath += 'value/';
                } else if (!dataPath.endsWith('content/') && !block.struct) {
                    dataPath += 'content/';
                }

                var data = rr.Routing.getData(dataPath, rr.Globals.stream_data) || rr.Globals.stream_data;

                for (i in block.children) {
                    var child = block.children[i];
                    if (child.name == 'styling') {
                        tmp_obj['styling'] = {};

                        for (i in child.children) {
                            grandchild = child.children[i];
                            name = grandchild.name;
                            value = '';
                            index = rr.Content.findNodeIndex(name, serialized_data);

                            if (index) {
                                value = serialized_data[index].value;
                            } else if (grandchild.type == 'BooleanBlock') {
                                value = false;
                            }
                            tmp_obj['styling'][name] = value;
                        }
                    } else if (serialized_data.hasOwnProperty(i)){
                        var value = serialized_data[i].value;
                        var type = child.type;
                        if (child.field) {
                            type = child.field.type;
                        }
                        if (type == 'StreamBlock') {
                            tmp_obj[child.name] = [];
                        } else if (value != "") {
                            tmp_obj[child.name] = value;
                        } else if (type == 'BooleanBlock') {
                            tmp_obj[child.name] = false;                    
                        } else if (type == 'ListBlock') {
                            tmp_obj['value'] = [];
                        } else if (type == 'ModelChoiceField') {
                            tmp_obj[child.name] = null;
                        } else {
                            tmp_obj[child.name] = '';
                        }
                    } else {
                        tmp_obj[child.name] = [];
                    }
                }

                dataPath = dataPath + data.length + '/';
                if (block.struct) {
                    data.push({
                        'type': block.name,
                        'value': tmp_obj,
                    });
                    dataPath = dataPath + 'value/';
                } else {
                    data.push(tmp_obj);
                }

                rr.Gui.hideModal();

                var kwargs = rr.Helpers.getKwargs(tmp_obj, block);
                var path = source.attr('data-path') ? source.attr('data-path') : source.attr('data-params');
                if (path.endsWith('content/')) {
                    path = path.replace('content/', '');
                }
                rr.Gui.addBlock(block, treePath, path, dataPath, kwargs);
            } else {
                setTimeout(function(){
                    source.removeClass('button-longrunning-active');
                    source.removeAttr('disabled');
                    source.find('em').text(
                        buttonTexts[Math.floor(Math.random()*buttonTexts.length)]);
                }, 750);
            }
        };

        var validateEditForm = function(treePath, source) {
            var block = rr.Routing.getData(treePath);
            var fields = rr.Globals.modal.find('[name]');
            var validated = rr.Validation.validate(fields);

            source.addClass('button-longrunning-active');
            source.attr('disabled', 'disabled');

            if (validated) {
                var serialized_data = groupByName(fields.serializeArray());
                var dataPath = source.attr('data-path');
                var data = rr.Routing.getData(dataPath, rr.Globals.stream_data);
                var children = block.children;

                for (i in block.children) {
                    var child = block.children[i];
                    var hasValue = rr.Content.findNodeIndex(child.name, serialized_data);

                    if (child.name == 'styling') {
                        if (!data.styling) {
                            data.styling = {};
                        }
                        var stylingData = data.styling;
                        for (i in child.children) {
                            var grandchild = child.children[i];
                            var name = grandchild.name;
                            var index = rr.Content.findNodeIndex(name, serialized_data);

                            if (index) {
                                stylingData[name] = serialized_data[index].value;
                            } else if (grandchild.type == 'BooleanBlock') {
                                stylingData[name] = false;
                            }
                        }
                    } else if (child.type == 'BooleanBlock') {
                        if (hasValue) {
                            data[child.name] = true;
                        } else {
                            data[child.name] = false;
                        }
                    } else if (hasValue) {
                        if (child.field.type == 'ModelChoiceField' && serialized_data[hasValue].value == '') {
                            data[child.name] = null;
                        } else {
                            data[child.name] = serialized_data[hasValue].value;
                        }
                    } else if (child.field && (child.field.type == "MultipleChoiceField")) {
                        data[child.name] = [];
                    }
                }

                rr.Gui.hideModal();

                var label = block.label;
                var labelAttribute = block.options.title;
                if (labelAttribute) {
                    var appendToLabel = data[labelAttribute];
                    label += " - " + appendToLabel;
                }

                rr.find('[data-path="' + dataPath + '"] .rr_header_label:first').text(label);

                if (block.type == 'ListBlock' && data.hasOwnProperty('grid')) {
                    var grid = data['grid'].trim();
                    grid = grid.replace(/(col-)/g, '');
                    rr.find('.rr_gridblock[data-path="' + dataPath + '"]')
                    .attr('class', 'rr_gridblock ' + grid)
                    .find('.rr_header_label:first').text(data['title']);
                }
            } else {
                setTimeout(function(){
                    source.removeClass('button-longrunning-active');
                    source.removeAttr('disabled');
                    source.find('em').text(
                        buttonTexts[Math.floor(Math.random()*buttonTexts.length)]);
                }, 250);
            }
        }


        var pickBlock = function(params, source){
            var block = rr.Routing.getData(params);
            var dataPath = source.attr('data-path');
            rr.Gui.hideModal();

            if (block.type == 'ListBlock') { // block.name.endsWith('_width')
                rr.Gui.addBlockWrapper(block.name, params, dataPath);
            } else {
                // Since its not a ListBlock we can just show the form right away
                var parent = rr.Routing.getParentData(rr.Routing.stringToPath(params), rr.Globals.tree);
                var data = rr.Routing.getData(dataPath, rr.Globals.stream_data)[parent.name];
                dataPath = dataPath + parent.name + '/';
                rr.Gui.openForm(block.children, params, dataPath, 'validateForm');
            }
        };

        var deleteItem = function(params, source){
            var dataPath = source.attr('data-path');
            var element = rr.find('[data-path="' + dataPath + '"]:first');
            var siblings = element.siblings('[data-path]');

            rr.Routing.deleteData(dataPath);
            element.remove();
            rr.Routing.updatePaths(siblings);
        };

        var edit = function(treePath, source) {
            var dataPath = source.attr('data-path');
            var block = rr.Routing.getData(treePath, rr.Globals.tree);

            if (block.type == 'StreamBlock'){
                rr.Gui.editBlockPicker(block, dataPath);
            } else {
                rr.Gui.openForm(block.children, treePath, dataPath, 'validateEditForm');
            }
        };

        var copy = function(params, source) {
            var dataPath = source.attr('data-path');
            var element = rr.find('[data-path="' + dataPath + '"]:first');
            var clone = element.clone();
            clone.addClass('cloned');
            setTimeout(function(){clone.removeClass('cloned')}, 2000);
            element.after(clone);
            var path = rr.Routing.stringToPath(dataPath);
            var data = rr.Routing.getData(path, rr.Globals.stream_data);

            if (path[path.length - 1] == 'value') {
                shorten_path = path.slice(0, path.length - 1);
                data = rr.Routing.getData(shorten_path, rr.Globals.stream_data);
            }

            var parent = rr.Routing.getParentData(path, rr.Globals.stream_data);

            if (parent.hasOwnProperty('value')) {
                parent = parent.value;
            } else if (parent.hasOwnProperty('content')) {
                parent = parent.content;
            }

            var indexOf = parent.indexOf(data);
            parent.splice(indexOf, 0, rr.Helpers.clone(data)); // insert on position indexOf

            var siblings = element.parent().find('> [data-path]');
            rr.Routing.updatePaths(siblings);

            $.each(clone.find('.rr_children'), function(i, node){
                rr.Dragging.sortable($(node), {
                    items: '> div',
                    axis: false, // 'y'
                    tolerance: "pointer",
                    containment: false,
                });
            });
        };

        return {
            'addChild': addChild,
            'editBlock': editBlock,
            'validateForm': validateForm,
            'validateEditForm': validateEditForm,
            'pickBlock': pickBlock,
            'delete': deleteItem,
            'edit': edit,
            'copy': copy,
        }
    })();
    rr.Ajax = (function(){

        // id = dom data-id attribute of DOM element
        // value = id of image
        var initImage = function(name, imageId){
            $.get(rr.Globals.urls.image + '?id=' + imageId, function(data){
                if(!data){
                    // no image returned
                    return;
                }

                var target = $('input[name="' + name + '"]').prev();
                $('div.chosen', target).show(0);
                $('div.preview-image img', target).attr('src', data);
                $('div.unchosen', target).hide(0);
            });
        };

        // id = dom data-id attribute of DOM element
        // value = id of document
        var initDocument = function(name, documentId){
            $.get(rr.Globals.urls.document + '?id=' + documentId, function(data){
                if(!data){
                    // no image returned
                    return;
                }

                var target = $('input[name="' + name + '"]').prev();
                $('div.chosen', target).show(0);
                $('span.title').html(data);
                $('div.unchosen', target).hide(0);
            });
        };

        // id = dom data-id attribute of DOM element
        // value = id of page
        var initPage = function(name, pageId){
            $.get(rr.Globals.urls.page + '?id=' + pageId, function(data){
                if(!data){
                    // no image returned
                    return;
                }

                var target = $('input[name="' + name + '"]').prev();
                $('div.chosen', target).show(0);
                $('span.title').html(data);
                $('div.unchosen', target).hide(0);
            });
        };

        // id = dom data-id attribute of DOM element
        // value = id of product
        var initProduct = function(name, productId){
            $.get(rr.Globals.urls.product + '?id=' + productId, function(data){
                if(!data){
                    // no product returned
                    return;
                }

                var target = $('input[name="' + name + '"]').prev();
                $('div.chosen', target).show(0);
                $('span.title').html(data);
                $('div.unchosen', target).hide(0);
            });
        };

        return {
            'initImage': initImage,
            'initDocument': initDocument,
            'initPage': initPage,
            'initProduct': initProduct,
        };
    })();
    var TEMPLATE_VARS = {
    };

    var PRIMITIVE_FIELDS = [
        'CharField',
        'ChoiceField',
        'IntegerBlock',
        'DateBlock',
        'BooleanBlock',
        'EmailBLock',
        'URLBlock',
        'ImageChooserBlock',
        'PageChooserBlock',
        'RichTextBlock',
        'DocumentChooserBlock',
        'ColorPickerBlock',
        'RawHTMLBlock',
        'TableBlock',
        'TextBlock',
        'ModelChoiceField',
        'GridChoiceBlock',
        'ProductChooserBlock',
    ];

    /*
    -- Overview of all Django fields that might show up
    'BigIntegerField',
    'BinaryField',
    'BooleanField',
    'CharField',
    'CommaSeparatedIntegerField',
    'DateField',
    'DateTimeField',
    'DecimalField',
    'DurationField',
    'EmailField',
    'FileField',
    'FilePathField',
    'FloatField',
    'GenericIPAddressField',
    'ImageField',
    'IntegerField',
    'NullBooleanField',
    'PositiveIntegerField',
    'PositiveSmallIntegerField',
    'SlugField',
    'SmallIntegerField',
    'TextField',
    'TimeField',
    'URLField',
    */
    rr.Content = (function(){
        // Takes a parent div "data-id", a state (which comes from the revision
        // table in Wagtail) and a tree describing the streamfields that might show
        // up
        var addContent = function(dataPath, treePath){
            var state = rr.Routing.getData(dataPath, rr.Globals.stream_data);
            var tree = rr.Routing.getData(treePath, rr.Globals.tree);
            if (!tree) return;
            if(tree.type == 'StreamBlock'){
                var treePath = treePath + 'children/';
                for(var i in state){
                    var item = state[i];
                    if (!item.hasOwnProperty('type')) continue;

                    var index = findNodeIndex(item.type, tree.children);
                    var node = tree.children[index];

                    if (!node) {
                        // If streamfields magically disappear 
                        continue;
                    }

                    var tp = treePath + index + '/';
                    var dp = dataPath + i + '/';

                    if (node.type == 'ListBlock') {
                        rr.Gui.addBlockWrapper(node.name, tp, dp, true);
                    } else {
                        dp = dp + 'value/';
                        var kwargs = rr.Helpers.getKwargs(item, node);
                        var splitted = rr.Routing.stringToPath(dataPath);
                        splitted.pop();
                        var parentPath = rr.Routing.pathToString(splitted) + '/';
                        rr.Gui.addBlock(rr.Routing.getData(tp), tp, parentPath, dp, kwargs);
                    }
                    addContent(dp, tp);
                }
            } else if (tree.type == 'ListBlock') {
                // var treePath = treePath + 'children/';
                for(var i in state['value']){
                    var item = state['value'][i];
                    var dp = dataPath + 'value/' + i + '/';

                    var kwargs = rr.Helpers.getKwargs(item, tree);
                    rr.Gui.addBlock(tree, treePath, dataPath, dp, kwargs);

                    addContent(dp, treePath + 'children/');
                }

            } else {
                if (state.length == 0) return;
                for (i in state) {
                    var items = state[i];
                    if (!rr.Helpers.isArray(items)) continue;
                    var index = findNodeIndex(i, tree);
                    var tp = treePath + index + '/';
                    var dp = dataPath + i + '/';
                    addContent(dp, tp);
                }
            }
        };

        // Take a tree and find the index of a node by name
        var findNodeIndex = function(name, tree){
            for(var i in tree){
                var node = tree[i];
                if(node.name == name){
                    return i;
                }
            }
            return false;
        };


        return {
            'addContent': addContent,
            'findNodeIndex': findNodeIndex,
        };
    })();
    rr.Dragging = (function(){
        var sortable = function(element, options, callback) {
            var options = $.extend({}, {
                // containment: 'parent',
                handle: '> .rr_block_header',
                cursor: 'move',
                revert: 250,
                placeholder: "ui-sortable-placeholder",
                forceHelperSize: true,
                forcePlaceholderSize: true,
                stop: update,
                start: function(event, ui) {
                    ui.placeholder.addClass(ui.helper.attr('class'));
                }
            }, options);

            if (callback) {
                options['change'] = callback;
            }

            element.sortable(options);
        };

        var update = function(event, ui) {
            var item = ui.item;
            var index = item.index();
            var dataPath = rr.Routing.stringToPath(item.attr('data-path'));
            if (dataPath[dataPath.length - 1] == 'value') {
                dataPath.splice(dataPath.length - 1); // splice "value" from path
            }
            var parentPath = dataPath.slice(0, dataPath.length - 1); // path minus last item, aka parent
            var data = rr.Routing.getData(dataPath, rr.Globals.stream_data);
            var parent = rr.Routing.getData(parentPath, rr.Globals.stream_data);
            var inArray = $.inArray(data, parent); // hopefully, will never fail, else problems
            
            if (inArray >= 0) {
                data = parent.splice(inArray, 1); // delete item
                parent.splice(index, 0, data[0]); // replace item on correct index
            }

            var items = $(this).find($(this).sortable('option', 'items'));
            rr.Routing.updatePaths(items);
        };

        return {
            'sortable': sortable,
        };
    })();

    rr.Events = (function(){

        // Sets up the DOM events we want to act on, passes it straight to rr.Actions
        var setupEvents = function(){
            rr.on('click', '.rr_action', function(event){
                event.preventDefault();
                event.stopPropagation();

                if($(this).hasClass('disabled')
                  || $(this).parent().hasClass('disabled')) {
                    return false;
                }

                var action = $(this).attr('data-action');
                var params = $(this).attr('data-params');

                if(typeof rr.Actions[action] !== 'undefined'){
                    rr.Actions[action](params, $(this));
                    rr.Globals.lastAction = action;
                } else {
                    console.log("Action not found: " + action);
                }
            });
        };

        var setupSaveEvents = function(){
            rr.Globals.form.submit(function(e) {
                var stream_data = JSON.stringify(rr.Globals.stream_data);
                rr.Globals.input.val(stream_data);
            });
        };

        $(document).on('hidden.bs.modal', '.rr_modal', function(){
            $(this).remove();
        });
        
        $(document).on('show.bs.modal', '.modal:not(.rr_modal)', function(){
            if (rr.Globals.modal) {
                rr.Globals.modal.addClass('unactive');
            }
        });

        $(document).on('hidden.bs.modal', '.modal:not(.rr_modal)', function(){
            if (rr.Globals.modal) {
                rr.Globals.modal.removeClass('unactive');
            }
        });

        jQuery.expr[':'].icontains = function(a, i, m) {
            return jQuery(a).text().toUpperCase()
                .indexOf(m[3].toUpperCase()) >= 0;
        };

        $(document).on('keyup change', '.search-blocks', function(){
            var searchTab = $('section#searched-blocks');
            if (this.value != '') {
                $('.modal:first .tab-content > section.active, .modal .tab-nav > li.active').removeClass('active');
                var query = $('.modal section:not(#searched-blocks) li:has(button[data-action=pickBlock] > span:icontains(' + this.value + '))');
                var html = '';
                query.each(function(i, node){
                    html += node.outerHTML;
                });
                var picker = rr.Html.getHtml('_BlockPicker');
                picker.set('items', html);
                searchTab.addClass('active').html(picker.html);
            } else {
                $('.modal:first .tab-content > section.active, .modal .tab-nav > li.active').removeClass('active');
                $('.modal:first .tab-content > section:first, .modal .tab-nav > li:first').addClass('active');
                // resetting...
            }
        });
            
        return {
            setupEvents: setupEvents,
            setupSaveEvents: setupSaveEvents,
        };
    })();

    rr.Fields = (function(){

        var getField = function(block, value) {
            var blockType = block.type;
            var hasValue = value !== null && typeof value !== 'undefined' && value !== '';
            var hasDefaultValue = block.default !== null && typeof value !== 'undefined';

            // Drill down on the actual type of this block, going to a primitive field
            if(PRIMITIVE_FIELDS.indexOf(blockType) === -1 && block.field && PRIMITIVE_FIELDS.indexOf(block.field.type) !== -1) {
                blockType = block.field.type;
            } else if(block.struct){
                blockType = 'StructBlock';
            }

            var html = rr.Html.getHtml(blockType);

            if (blockType == 'RichTextBlock') {
                html.set('opts', rr.Globals.rich_text_opts);
                if (value == "") {
                    value = "null";
                }
                // Fix single quotes HTML parsing errors
                // (and subsequent JSON parsing errors)
                value = value.replace(/'/g, "&apos;");
            }

            if(block.field){
                if(block.field.help_text){
                    html.set('help_text', block.field.help_text);
                } else {
                    html.set('help_text', '');
                }

                if(block.field.required && block.field.required === true){
                    html.set('required', 'required');
                }
            }
            html.set('required', '');

            var label = block.label;
            if(!block.label){
                label = block.name;
            }

            html.set('placeholder', label);
            html.set('label', label);
            html.set('path', block.name);

            if(blockType == 'ChoiceField' || blockType == 'ModelChoiceField' || blockType == 'MultipleChoiceBlock') {
                var choices = rr.Globals.choices[block.field.choices];
                var choicesHtml = '';
                for(var i in choices){
                    var choice = choices[i];
                    if(hasValue && (choice[0] == value || value.indexOf(choice[0]) > -1 )) {
                        choicesHtml += '<option value="' + choice[0] + '" selected="selected">' + choice[1] + '</option>';
                    } else {
                        choicesHtml += '<option value="' + choice[0] + '">' + choice[1] + '</option>';
                    }
                }
                html.set('choices', choicesHtml);
            } else if (blockType == 'IntegerBlock') {
                if(block.field.max_value) {
                    html.set('max', block.field.max_value);
                } else {
                    html.set('max', '');
                }

                if(block.field.min_value) {
                    html.set('min', block.field.min_value);
                } else {
                    html.set('min', '');
                }
            } else if (block.type == 'BooleanBlock') {
                if (value == 'true' || value == true) {
                    value = 'checked="checked"';
                }
            } else if (blockType == 'ImageChooserBlock' && hasValue && value != '') {
                rr.Ajax.initImage(block.name, value);
            } else if (blockType == 'PageChooserBlock' && hasValue && value != '') {
                rr.Ajax.initPage(block.name, value);
            } else if (blockType == 'DocumentChooserBlock' && hasValue && value != '') {
                rr.Ajax.initDocument(block.name, value);
            } else if (blockType == 'ProductChooserBlock' && hasValue && value != '') { 
                rr.Ajax.initProduct(block.name, value);
            } else if (blockType == 'GridChoiceBlock') {
                var choice = rr.Globals.choices[block.field.choices][1];
                var prefix = choice[0].substr(0, choice[0].length - choice[1].length);
                html.set('prefix', prefix);
            }

            if (hasValue) {
                html.set('value', value);
            } else if(hasDefaultValue) {
                html.set('value', block.default);
            } else {
                html.set('value', '');
            }

            return html.html;

        };

        return {
            'getField':  getField,
        }
    })();
    // All our "global" variables
    rr.Globals = {};
    rr.Gui = (function(){

        // The root block wraps around all our streamfields
        var createRootBlock = function(tree, treePath){
            var node = rr.Routing.getData(treePath, tree);
            var html = rr.Html.getHtml(node.type);
            html.set('tree_path', treePath);
            rr.html(html.html);
        };

        // Sets up the editor given a tree that defines all the streamfields and a
        // state which is the content_json that's saved into the page revision
        var setupEditor = function() {
            createRootBlock(rr.Globals.tree, '/');
        };

        var deviceViewSelect = function() {
            var deviceViewSelector = $('<div class="device-size-chooser"></div>');
            var sizes = [
                $('<div class="size xs" data-size="xs"></div>'),
                $('<div class="size sm" data-size="sm"></div>'),
                $('<div class="size md" data-size="md"></div>'),
                $('<div class="size lg selected" data-size="lg"></div>'),
            ];
            deviceViewSelector.append(sizes);

            deviceViewSelector.find('.size').on('click touchend', function(e){
                var size = $(this).data('size');
                rr.attr('class', 'rr_editor ' + size);
            });

            rr.before(deviceViewSelector);
        };

        var openModal = function(tabs, content, label) {
            var modal = rr.Html.getHtml('_Modal');
            modal.set('tabs', tabs);
            modal.set('content', content);
            modal.set('label', label);
            modal = $(modal.html);
            rr.append(modal);
            modal.modal('show');
            rr.Globals.modal = modal;
            return rr.Globals.modal;
        };

        var hideModal = function(modal) {
            if (modal) {
                modal.modal('hide');
            } else {
                rr.Globals.modal.modal('hide');
            }
        };

        var replaceModalContent = function(modal, id, content) {
            modal.find('#' + id).attr('class', 'active').html(content);
        };

        var openForm = function(children, treePath, dataPath, action){
            var fields = '';
            var styling_fields = '';

            var tabs_html = '';
            var content_html = '';

            var data = rr.Routing.getData(dataPath, rr.Globals.stream_data);

            for (i in children) {
                child = children[i];

                if (child.name == 'styling') {
                    var styling_data = data.hasOwnProperty('styling') ? data.styling : {};
                    for (i in child.children) {
                        grandchild = child.children[i];
                        var value = '';
                        if (styling_data.hasOwnProperty(grandchild.name)) {
                            value = styling_data[grandchild.name];
                        }
                        styling_fields += rr.Fields.getField(grandchild, value);
                    }

                } else if (!child.hasOwnProperty('children')) {
                    var value = '';
                    if (data.hasOwnProperty(child.name)) {
                        value = data[child.name];
                    }
                    var field = rr.Fields.getField(child, value);
                    fields += field;
                }
            }

            var tabs = rr.Html.getHtml('_ModalTab');
            tabs.set('classes', 'active');
            tabs.set('id', 'tab_content');
            tabs.set('label', 'Inhoud');
            tabs_html += tabs.html;

            var wrapper = rr.Html.getHtml('_FieldWrapper');
            wrapper.set('fields', fields);
            wrapper.set('tree_path', treePath);
            wrapper.set('data_path', dataPath);
            wrapper.set('action', action);

            var content = rr.Html.getHtml('_ModalContent');
            content.set('classes', 'active');
            content.set('id', 'tab_content');
            content.set('content', wrapper.html);
            content_html += content.html;


            if (styling_fields != '') {
                // we have styling fields, let's create a new tab with content
                var tabs = rr.Html.getHtml('_ModalTab');
                tabs.set('classes', '');
                tabs.set('id', 'tab_styling');
                tabs.set('label', 'Styling');
                tabs_html += tabs.html;

                var wrapper = rr.Html.getHtml('_FieldWrapper');
                var index = rr.Content.findNodeIndex('styling', children);
                wrapper.set('tree_path', treePath); //  + 'children/' + index + '/'

                wrapper.set('data_path', dataPath); // + 'styling/');
                wrapper.set('action', action);

                var content = rr.Html.getHtml('_ModalContent');
                content.set('classes', '');
                content.set('id', 'tab_styling');

                wrapper.set('fields', styling_fields);
                content.set('content', wrapper.html);
                content_html += content.html;
            }

            rr.Gui.openModal(tabs_html, content_html, 'Vul het formulier in');
        };

        var editBlockPicker = function(block, dataPath) {
            var data = rr.Routing.getData(dataPath, rr.Globals.stream_data);
            var html = rr.Html.getHtml('_BlockPicker');
            var items = '';

            for(var i in block.children){
                var itemHtml = rr.Html.getHtml('_BlockPickerItem');
                var child = block.children[i];
                if(child.icon){
                    itemHtml.set('icon', child.icon);
                } else {
                    itemHtml.set('icon', '');
                }
                if (child.name == data.type) {
                    itemHtml.set('classes', 'active');
                } else {
                    itemHtml.set('classes', '');
                }
                itemHtml.set('params', child.name);
                itemHtml.set('label', child.label);
                itemHtml.set('action', 'editBlock');
                items += itemHtml.html;
            }

            html.set('items', items);
            html.set('data_path', dataPath);

            var tabs = rr.Html.getHtml('_ModalTab');
            tabs.set('classes', 'active');
            tabs.set('id', 'tab_content');
            tabs.set('label', 'Inhoud');
            tabs = tabs.html;

            var content = rr.Html.getHtml('_ModalContent');
            content.set('classes', 'active stream-menu');
            content.set('id', 'tab_content');
            content.set('content', html.html);
            content = content.html;

            rr.Gui.openModal(tabs, content, 'Aanpassen');
        };

        var addBlockPicker = function(children, treePath, dataPath){
            var groups = {};

            for (var i in children){
                var itemHtml = rr.Html.getHtml('_BlockPickerItem');
                var child = children[i];
                var group = child.options.group || 'Default';
                if(child.icon){
                    itemHtml.set('icon', child.icon);
                } else {
                    itemHtml.set('icon', '');
                }
                itemHtml.set('data_path', dataPath);
                itemHtml.set('classes', '');
                itemHtml.set('params', treePath + 'children/' + i + '/');
                itemHtml.set('label', child.label);
                itemHtml.set('action', 'pickBlock');

                if ( groups.hasOwnProperty(group) ) {
                    groups[group] += itemHtml.html;
                } else {
                    groups[group] = itemHtml.html;
                }
            }

            var modal_content = '', tabs = '';
            for (var i in groups) {
                var picker = rr.Html.getHtml('_BlockPicker');
                picker.set('data_path', dataPath);
                picker.set('items', groups[i]);

                var tab = rr.Html.getHtml('_ModalTab');
                var tab_content = rr.Html.getHtml('_ModalContent');

                if (Object.keys(groups).indexOf(i) == 0) {
                    tab.set('classes', 'active');
                    tab_content.set('classes', 'active stream-menu');
                } else {
                    tab.set('classes', '');
                    tab_content.set('classes', 'stream-menu');
                }
                tab.set('id', i.toLowerCase());
                tab.set('label', i);

                tab_content.set('id', i.toLowerCase());
                tab_content.set('content', picker.html);

                tabs += tab.html;
                modal_content += tab_content.html;
            }

            var label = '<div class="iconfield field-small"><span class="input icon-search"><input type="text" class="search-blocks" placeholder="Zoeken..." /></span></div>';

            rr.Gui.openModal(tabs, modal_content, label);
        };

        var addBlock = function(block, treePath, parentPath, dataPath, kwargs){
            var blockType = block.type;

            if (kwargs.hasOwnProperty('type')) {
                blockType = kwargs['type'];
            }

            var html = rr.Html.getHtml(blockType);
            var header = rr.Html.getHtml('block_header');

            if ('append_to_datapath' in kwargs) {
                dataPath += kwargs['append_to_datapath'];
            }

            if (blockType == 'ListBlock') {
                var add_button = rr.Html.getHtml('_ButtonAdd');

                if ('append_to_treepath' in kwargs) {
                    add_button.set('tree_path', treePath + kwargs['append_to_treepath']);
                } else {
                    add_button.set('tree_path', treePath + 'children/2/'); // find index of "content"
                }

                header.set('add_button', add_button.html);
                html.set('width', kwargs['width']);
            } else {
                header.set('add_button', '');
                // html.set('preview', kwargs['preview']);
            }

            var edit_button = rr.Html.getHtml('_ButtonEdit');
            edit_button.set('data_path', dataPath);
            edit_button.set('tree_path', treePath);

            html.set('data_path', dataPath);
            html.set('tree_path', treePath);
            header.set('data_path', dataPath);
            header.set('tree_path', treePath);
            header.set('edit_button', edit_button.html);
            header.set('label', kwargs['label']);
            html.set('header', header.html);
            html = $(html.html);

            var element = rr.find('[data-path="' + parentPath + '"]:first > .rr_children');

            if (!element.length) {
                element = rr.find('.rr_items');
            }

            element.append(html);

            if (blockType == 'ListBlock') {
                rr.Dragging.sortable(html.find('.rr_children:first'), {
                    items: '> div',
                    axis: false, // 'y'
                    tolerance: "pointer",
                    containment: false,
                });   
            }

            return dataPath;
        };

        var addBlockWrapper = function(value, treePath, dataPath, notNewData) {
            var block = rr.Routing.getData(treePath);
            // var label = '<button data-action="preview" title="Preview ' + block.label + '" class="button rr_action text-replace icon icon-view"></button> ' + block.label; // ' + block.icon + '
            var label = block.label;
            // path before we edit it
            if (!notNewData) {
                var parentPath = dataPath;
            
                if (!dataPath) {
                    dataPath = '';
                } else {
                    dataPath += 'content/'; // TODO: probably not want to do this static
                    // Maybe a getData and loop through it to find an item with "children"
                }
                var data = rr.Routing.getData(dataPath, rr.Globals.stream_data);
                var length = data.length;
                data.push({
                    'type': value,
                    'value': [],
                });
                // Notice we get the length first before we set the new dataPath
                // setting the new dataPath
                dataPath += length + '/';
            } else {
                var splitted = rr.Routing.stringToPath(dataPath);
                splitted.pop();
                splitted.pop();
                if (splitted.length > 0) {
                    var parentPath = rr.Routing.pathToString(splitted) + '/';
                } else {
                    var parentPath = '';
                }
                var data = rr.Routing.getData(dataPath, rr.Globals.stream_data);
            }

            var html = rr.Html.getHtml('_BlockWrapper');
            var add_button = rr.Html.getHtml('_ButtonAdd');
            var header = rr.Html.getHtml('block_header');
            add_button.set('tree_path', treePath);
            header.set('data_path', dataPath);
            header.set('add_button', add_button.html);
            if (parentPath == ''){
                var edit_button = rr.Html.getHtml('_ButtonEdit');
                edit_button.set('data_path', dataPath);
                edit_button.set('tree_path', '');
                header.set('edit_button', edit_button.html);
            } else {
                header.set('edit_button', ''); // no edit button for deeper list blocks
            }
            header.set('label', label);
            html.set('data_path', dataPath);
            html.set('tree_path', treePath);
            html.set('width', value);
            html.set('header', header.html);
            html = $(html.html);

            // if we have no upper items, just append it to the editor
            if (parentPath != '') {
                // we assume there are gridblocks in the parent
                rr.find('.rr_gridblock[data-path="' + parentPath + '"] > .rr_children').append(html);
            } else {
                rr.find('div.rr_items').append(html);
            }

            rr.Dragging.sortable(html.find('.rr_children:first'), {
                items: '> div',
                axis: false,
                tolerance: "pointer",
                containment: false,
            });
        };

        var help = function(msg, duration, html) {
            var wrapper = $('<div class="help-wrapper"></div>');
            var message = $('<span class="help"></span>');

            if (html){
                message.html(msg);
            } else {
                message.text(msg);
            }

            wrapper.html(message);

            rr.append(wrapper);

            if (duration) {
                setTimeout(function(){
                    wrapper.remove();
                }, duration);
            }
        };

        // Flag all the inputs/textareas/selects that are required but have no
        // value
        var flagMissingFields = function(){
            var fields = 'input[data-required=required], '
                + 'select[data-required=required], ' 
                + 'textarea[data-required=required]';

            var flagged = 0;

            // Inputs
            rr.find(fields).filter(function() {
                if(!this.value){
                    flagged++;
                    rr.Validation.addErrorMessage(this, 'Dit veld is verplicht.')
                }
                return !this.value;
            }).addClass("missing");

            $('textarea.missing').each(function(){
                $(this).prev().addClass('missing');
            });

            /* Expand all missing fields */
            $('.missing').each(function(){
                $(this).parents('.rr_block').each(function(){
                    $(this).children('.rr_block_header').each(function(){
                        $('.rr_action[data-action=extend]', $(this)).trigger('click');
                    });
                });
            });

            return flagged;
        };

        var unFlagMissingFields = function(){
            $('.missing').removeClass('missing');
        };

        return {
            'setupEditor': setupEditor,
            'deviceViewSelect': deviceViewSelect,
            'openModal': openModal,
            'hideModal': hideModal,
            'replaceModalContent': replaceModalContent,
            'openForm': openForm,
            'editBlockPicker': editBlockPicker,
            'addBlockPicker': addBlockPicker,
            'addBlockWrapper': addBlockWrapper,
            'addBlock': addBlock,
            'help': help,
            'flagMissingFields': flagMissingFields,
            'unFlagMissingFields': unFlagMissingFields,
        };
    })();
    rr.Helpers = (function(){

        var justFunc = function(func) {
            if(typeof func === 'undefined') {
                return function(){};
            } else {
                return func;
            }
        };

        var capitalize = function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        var isArray = function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };

        var clone = function(obj) {
            if(isArray(obj)) {
                return obj.slice(0);
            } else {
                return jQuery.extend(true, {}, obj);
            }
        };

        var has = function(object, key) {
            return object ? hasOwnProperty.call(object, key) : false;
        };

        var cleanPath = function(path){
            var splitted = path.split('-');
            var newPath = [];
            var lastNumber = false;
            for(var i in splitted){
                var part = splitted[i];
                if(!isNaN(part)) {
                    if(lastNumber){
                        newPath.push('value');
                    }
                    newPath.push(part);
                    lastNumber = true;
                } else {
                    lastNumber = false;
                    newPath.push(part);
                }
            }
            return newPath.join('-');
        };

        // Receive a block that has no name and try to make a pretty name for it
        // (or return an empty name when that doesn't work it)
        // FIXME: this function should actually not really be necessary
        var resolveName = function(block){
            if(block.type == 'ProductChooserBlock'){
                return 'Product id';
            }
            if(block.type == 'ImageChooserBlock'){
                return 'Afbeelding';
            }
            return '';
        };



        var getKwargs = function(data, block) {
            var kwargs = {};

            if (typeof data['grid'] == 'string'){
                var grid = data['grid'].trim();
                grid = grid.replace(/(col-)/g, '');
                kwargs['width'] = grid;
                kwargs['label'] = data['title'];
            } else {
                var new_type = 'StructBlock';

                for (i in block.children) {
                    var child = block.children[i];
                    if (child.type == 'ListBlock') {
                        new_type = 'ListBlock';
                        kwargs['append_to_treepath'] = 'children/' + i + '/';
                        break;
                    }
                }

                var label = block.label;
                var labelAttribute = block.options.title;
                if (labelAttribute) {
                    if (typeof data.value == "object") {
                        var appendToLabel = data.value[labelAttribute];
                    } else {
                        var appendToLabel = data[labelAttribute]
                    }
                    label += " - " + appendToLabel;
                }
                kwargs['label'] = label;
                kwargs['type'] = new_type;
            }

            return kwargs;
        };

        return {
            justFunc: justFunc,
            capitalize: capitalize,
            clone: clone,
            isArray: isArray,
            has: has,
            cleanPath: cleanPath,
            resolveName: resolveName,
            getKwargs: getKwargs,
        };

    })();
    rr.Html = (function(){
        var getHtml = function(file){
            var htmlEntity = new rr.HtmlEntity();
            if(rr.HtmlCache[file]) {
                htmlEntity.init(rr.HtmlCache[file]);
            } else {
                htmlEntity.init('rr.Html for ' + file + ' not found');
            }
            return htmlEntity;
        };

        var getMultipleHtml = function(files) {
            var result = {};

            if(files.length == 0) return {};

            for(var i in files){
                var htmlEntity = getHtml(files[i]);
                result[files[i]] = htmlEntity;
            }

            return result;
        };

        return {
            getHtml: getHtml,
            getMultipleHtml: getMultipleHtml,
        };
    })();
    rr.HtmlCache = {
        '_EditBlock': '<div class="rr_block rr_listblock rr_parentblock" data-treepath="{{tree_path}}" data-path="{{path}}"><button type="button" data-action="addChild" data-params="{{id}}" class="rr_action addChild button"></button></div>',
        'RichTextBlock': '<div class="rr_richtextfield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><input value=\'{{value}}\' type="hidden" data-required="{{required}}" id="field_{{path}}" name="{{path}}" placeholder="{{placeholder}}"/><script>window.draftail.initEditor("#field_{{path}}", {{opts}});</script><span></span></div><span class="help">{{help_text}}</span></div></div>',
        '_ButtonEdit': '<button type="button" title="Aanpassen" data-action="edit" data-path="{{data_path}}" data-params="{{tree_path}}" class="rr_action button icon text-replace icon-edit">Aanpassen</button>',
        'ChoiceField': '<div class="rr_choicefield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="field char_field widget-text_input fieldname-title grid-title"><div class="field-content"><div class="input"><select name="{{path}}" data-required="{{required}}" placeholder="{{placeholder}}">{{choices}}</select><span class="help">{{help_text}}</span></div></div></div></div></div>',
        'MultipleChoiceBlock': '<div class="rr_choicefield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="field char_field widget-text_input fieldname-title grid-title"><div class="field-content"><div class="input"><select multiple name="{{path}}" data-required="{{required}}" placeholder="{{placeholder}}">{{choices}}</select><span class="help">{{help_text}}</span></div></div></div></div></div>',
        'CharField': '<div class="rr_charfield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><input data-required="{{required}}" maxlength="255" name="{{path}}" placeholder="{{placeholder}}" value="{{value}}" type="text" /><span class="help">{{help_text}}</span></div></div></div>',
        'DateBlock': '<div class="rr_datefield rr_block date_field"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><input id="{{path}}" name="{{path}}" data-required="{{required}}" placeholder="Datum" type="text" value="{{value}}" /><script>initDateChooser("{{path}}", {"dayOfWeekStart": 1, "format": "Y-m-d"});</script><span class="help">{{help_text}}</span></div></div></div>',
        '_BlockPicker': '<div class="rr_addChild stream-menu-inner" data-path="{{data_path}}"><ul>{{items}}</ul></div>',
        'ModelChoiceField': '<div class="rr_choicefield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="field char_field widget-text_input fieldname-title grid-title"><div class="field-content"><div class="input"><select name="{{path}}" data-required="{{required}}" placeholder="{{placeholder}}">{{choices}}</select><span class="help">{{help_text}}</span></div></div></div></div></div>',
        'PageChooserBlock': '<div class="rr_pagefield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><div id="{{path}}-chooser" class="chooser page-chooser blank"><div class="chosen"><span class="title"></span><ul class="actions"><!-- <li><button type="button" class="button action-clear button-small button-secondary">Leeg keuze</button></li> --><li><button type="button" class="button action-choose button-small button-secondary">Kies een andere pagina</button></li><!-- <li><a href="" class="edit-link button button-small button-secondary" target="_blank">Wijzig deze pagina</a></li> --></ul></div><div class="unchosen"><button type="button" class="button action-choose button-small button-secondary">Kies een pagina</button></div></div><input id="{{path}}" name="{{path}}" placeholder="Pagina" value="{{value}}" type="hidden"><script>createPageChooser("{{path}}",["wagtailcore.page"], null, true);</script><span></span><span class="help">{{help_text}}</p></div></div></div>',
        'BooleanBlock': '<div class="rr_booleanfield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><input name="{{path}}" placeholder="{{placeholder}}" type="checkbox" {{value}} /><br/><span class="help">{{help_text}}</span></div></div></div>',
        'block_header': '<div class="rr_block_header"><div class="button-group button-group-square">{{edit_button}}<button type="button" title="Kopiëren" data-action="copy" data-path="{{data_path}}" class="rr_action button icon text-replace icon-fa-clone">Kopiëren</button>{{add_button}}<span class="rr_header_label">{{label}}</span><button type="button" title="Verwijderen" data-action="delete" data-path="{{data_path}}" class="rr_action button icon text-replace hover-no icon-bin">Verwijderen</button></div><br class="clearfix" /></div>',
        'TextBlock': '<div class="rr_textfield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><textarea data-required="{{required}}" name="{{path}}" placeholder="{{placeholder}}">{{value}}</textarea><span class="help">{{help_text}}</span></div></div></div>',
        'ListWrapper': '<div class="rr_block rr_listwrapper rr_parentblock"><div class="rr_header"> <div class="button-group button-group-square"><button type="button" title="Verwijderen" data-action="delete" data-path="{{path}}" class="rr_action button icon text-replace hover-no icon-bin">Verwijderen</button> </div><br class="clearfix" /> </div><div class="rr_block_content"><div class="rr_children"></div></div></div>',
        'TableBlock': '<div class="rr_tablefield rr_block"><div class="rr_block_content"><div class="input"><div class="field boolean_field widget-checkbox_input"><label for="{{path}}-handsontable-header">Rij-header</label><div class="field-content" style="width: 80%;"><div class="input"><input id="{{path}}-handsontable-header" name="{{path}}-handsontable-header" type="checkbox" /></div><p class="help">Geef de eerste rij weer als een header.</p></div></div><br/><div class="field boolean_field widget-checkbox_input"><label for="{{path}}-handsontable-col-header">Kolomheader</label><div class="field-content" style="width: 80%;"><div class="input"><input id="{{path}}-handsontable-col-header" name="{{path}}-handsontable-col-header" type="checkbox" /></div><p class="help">Geef de eerste kolom als een header weer.</p></div></div><br/><div id="{{path}}-handsontable-container" style="height: 135px; overflow: hidden; width: 100%;" class="handsontable"></div><!-- old table value:{&quot;data&quot;:[[null,&quot;&quot;,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],&quot;first_row_is_table_header&quot;:false,&quot;first_col_is_header&quot;:false}--><input id="{{path}}" name="{{path}}" placeholder="Tabel" value="{{value}}" type="hidden" /><script>initTable("{{path}}", {"minSpareRows": 0, "startRows": 4, "height": 108, "autoColumnSize": false, "renderer": "text", "startCols": 4, "stretchH": "all", "language": "nl", "rowHeaders": false, "contextMenu": true, "editor": "text", "colHeaders": false});</script><span></span><p class="help">HTML is mogelijk in de tabel</p></div></div></div>',
        '_BlockWrapper': '<div class="rr_blockwrapper {{width}}" data-path="{{data_path}}" data-treepath="{{tree_path}}"> {{header}}<div class="rr_children"></div></div>',
        'StreamBlock': '<div class="rr_items"></div><div class="rr_new_block full_width"><button type="button" data-action="addChild" data-params="{{tree_path}}" class="rr_action addChild button"></button></div>',
        '_ModalContent': '<section id="{{id}}" class="{{classes}}">{{content}}</section>',
        'GridChoiceBlock': '<div class="rr_gridchoicefield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><input id="{{path}}" name="{{path}}" placeholder="Grid" value="{{value}}" type="hidden"><script>createGridChooser("{{path}}");</script><span></span><span class="help">{{help_text}}</p></div></div></div>',
        'ListBlock': '<div class="rr_listblock rr_gridblock {{width}}" data-path="{{data_path}}">{{header}}<div class="rr_children"></div></div>',
        '_BlockPickerItem': '<li><button type="button" data-action="{{action}}" data-path="{{data_path}}" data-params="{{params}}" class="rr_action button icon icon-{{icon}} {{classes}}"><span>{{label}}</span></button></li>',
        '_ButtonAdd': '<button type="button" data-action="addChild" title="Voeg inhoud toe" data-params="{{tree_path}}" class="rr_action button icon text-replace icon-plus">Toevoegen</button>',
        'ImageChooserBlock': '<div class="rr_imagefield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><div id="field_{{path}}-chooser" class="chooser image-chooser blank"><div class="chosen"><div class="preview-image"><img></div><ul class="actions"><!-- <li><button type="button" class="button action-clear button-small button-secondary">Leeg keuze</button></li> --><li><button type="button" class="button action-choose button-small button-secondary">Kies een andere afbeelding</button></li><!-- <li><a href="" class="edit-link button button-small button-secondary" target="_blank">Wijzig deze afbeelding</a></li> --></ul></div><div class="unchosen"><button type="button" class="button action-choose button-small button-secondary">Kies een afbeelding</button></div></div><input value="{{value}}" name="{{path}}" id="field_{{path}}" placeholder="Afbeelding" type="hidden" data-required="{{required}}"><script>createImageChooser("field_{{path}}");</script><span></span><span class="help">{{help_text}}</p></div></div></div>',
        'ColorPickerBlock': '<div class="rr_colorpicker rr_block"><div class="rr_block_content"><label class="{{required}}" for="field_{{path}}">{{label}}</label><div class="input"><input data-required="{{required}}" maxlength="10" id="field_{{path}}" name="{{path}}" placeholder="{{placeholder}}" value="{{value}}" type="text" /><span class="help">{{help_text}}</span></div></div></div><script type="text/javascript">var field = $(\'input#field_{{path}}\');field.ColorPicker();var value = \'{{value}}\';if (value == \'\') {value = \'#FFFFFF\';}field.ColorPickerSetColor(value);</script>',
        'RawHTMLBlock': '<div class="rr_htmlblock rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><textarea data-required="{{required}}" name="{{path}}" cols="40" rows="10" placeholder="{{placeholder}}">{{value}}</textarea><span class="help">{{help_text}}</span></div></div></div>',
        'EmailBlock': '<div class="rr_emailfield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><input data-required="{{required}}" name="{{path}}" placeholder="{{placeholder}}" type="email" value="{{value}}"/><span class="help">{{help_text}}</span></div></div></div>',
        'IntegerBlock': '<div class="rr_integerfield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><input data-required="{{required}}" max="{{max}}" min="{{min}}" name="{{path}}" placeholder="{{placeholder}}" value="{{value}}" type="number" /><span class="help">{{help_text}}</span></div></div></div>',
        'DocumentChooserBlock': '<div class="rr_documentfield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><div id="{{path}}-chooser" class="chooser document-chooser blank"><div class="chosen"><span class="title"></span><ul class="actions"><!-- <li><button type="button" class="button action-clear button-small button-secondary">Leeg keuze</button></li> --><li><button type="button" class="button action-choose button-small button-secondary">Kies een ander document</button></li><!-- <li><a href="" class="edit-link button button-small button-secondary" target="_blank">Wijzig dit document</a></li> --></ul></div><div class="unchosen"><button type="button" class="button action-choose button-small button-secondary">Kies een document</button></div></div><input id="{{path}}" name="{{path}}" placeholder="Document" value="{{value}}" type="hidden"><script>createDocumentChooser("{{path}}");</script><span></span><span class="help">{{help_text}}</p></div></div></div>',
        '_ModalTab': '<li class="{{classes}}"><a href="#{{id}}">{{label}}</a></li>',
        '_Modal': '<div class="rr_modal modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><button type="button" class="button close icon text-replace icon-cross" data-dismiss="modal" aria-hidden="true">×</button><div class="modal-body"><header class="merged tab-merged "><div class="row nice-padding"><div class="left"><div class="col header-title"><h1 class="icon icon-docs">{{label}}</h1></div></div></div></header><ul class="tab-nav merged">{{tabs}}</ul><div class="tab-content">{{content}}<section id="searched-blocks" class="stream-menu"></section></div></div></div></div></div>',
        '_FieldWrapper': '<div class="rr_fields">{{fields}}<button type="button" class="button button-longrunning rr_action" data-action="{{action}}" data-path="{{data_path}}" data-params="{{tree_path}}"><span class="icon icon-spinner"></span><em>Pas toe</em></button></div>',
        'StructBlock': '<div class="rr_structblock" data-path="{{data_path}}">{{header}}<div class="rr_block_preview_content">{{preview}}</div></div>',
        'URLBlock': '<div class="rr_urlfield rr_block url_field"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><input data-required="{{required}}" name="{{path}}" placeholder="{{placeholder}}" value="{{value}}" type="url" /><span class="help">{{help_text}}</span></div></div></div>',
        'ProductChooserBlock': '<div class="rr_productfield rr_block"><div class="rr_block_content"><label class="{{required}}" for="{{path}}">{{label}}</label><div class="input"><div id="{{path}}-chooser" class="chooser product-chooser blank"><div class="chosen"><span class="title"></span><ul class="actions"><!-- <li><button type="button" class="button action-clear button-small button-secondary">Leeg keuze</button></li> --><li><button type="button" class="button action-choose button-small button-secondary">Kies een ander product</button></li><!-- <li><a href="" class="edit-link button button-small button-secondary" target="_blank">Wijzig dit product</a></li> --></ul></div><div class="unchosen"><button type="button" class="button action-choose button-small button-secondary">Kies een product</button></div></div><input id="{{path}}" name="{{path}}" placeholder="Product" value="{{value}}" type="hidden"><script>createProductChooser("{{path}}");</script><span></span><span class="help">{{help_text}}</p></div></div></div>',       
    };
    rr.HtmlEntity = function() {
        this.html = null;
    };

    rr.HtmlEntity.prototype.init = function(html) {
        this.html = html;
        for (var key in TEMPLATE_VARS) {
            if (!TEMPLATE_VARS.hasOwnProperty(key)) continue;
            this.set(key, TEMPLATE_VARS[key]);
        }
    };

    rr.HtmlEntity.prototype.set = function(key, value) {
        this.html = this.html.replace(new RegExp('{{' + key + '}}', 'g'), value);
        return this;
    };

    /* ============================================= */
    /* DEBUGGING examples */

    // This shows how to collect all the different streamtypes and filter out all
    // the uniques

    /*
    var types = collectTypes(rr.Globals.tree);

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    var unique = types.filter(onlyUnique);
    */

    var collectTypes = function(tree){
        var result = [];

        var blockType = tree.type;

        if(PRIMITIVE_FIELDS.indexOf(blockType) === -1 && tree.field && PRIMITIVE_FIELDS.indexOf(tree.field.type) !== -1) {
            blockType = tree.field.type;
        }

        if(!tree.struct){
            result.push(blockType);
        }
        for(var i in tree.children){
            var child = tree.children[i];
            result = result.concat(collectTypes(child));
        }
        return result;
    };
    rr.Routing = (function(){

        var pathToString = function(path){
            return path.join('/');
        };

        var stringToPath = function(str){
            var splitted = str.split('/');
            if(splitted[splitted.length - 1] == '') {
                splitted.pop();
            }
            if(splitted[0] == ''){
                splitted.shift();
            }
            return splitted;
        };

        var getData = function(path, data) {
            if(typeof path === 'string') {
                path = stringToPath(path);
            }
            if(typeof data === 'undefined'){
                data = rr.Globals.tree;
            }
            return _getData(rr.Helpers.clone(path), data);
        };

        var _getData = function(path, data){
            if(path.length == 0) {
                return data;
            }
            else if(path.length == 1) {
                return data[path];
            } else {
                var next = path.shift();
                return _getData(path, data[next]);
            }
        };

        var deleteData = function(path, data) {
            if(typeof path === 'string') {
                path = stringToPath(path);
            }
            if(typeof data === 'undefined'){
                data = rr.Globals.stream_data;
            }
            return _deleteData(rr.Helpers.clone(path), data);
        };

        var _deleteData = function(path, data){
            if(path.length == 0) {
                delete data;
            } else if (path.length == 1) {
                data.splice(path, 1);
            } else if (path.length == 2 && rr.Helpers.isArray(data)) {
                data.splice(path[0], 1);
            } else {
                var next = path.shift();
                return _deleteData(path, data[next]);
            }
        };

        var getParentData = function(path, data) {
            return _getParentData(rr.Helpers.clone(path), data); 
        };

        var _getParentData = function(path, data) {
            if(path.length <= 2) {
                return data;
            } else {
                var next = path.shift();
                return _getParentData(path, data[next]);
            }
        };

        var updatePaths = function(elements) {
            elements.each(function(i, element){
                var item = $(element);
                var currentPath = item.attr('data-path');
                var path = stringToPath(currentPath);
                if (path[path.length - 1] == 'value') {
                    path[path.length - 2] = i;
                } else {
                    path[path.length - 1] = i; // set new index, assuming i is index
                }
                var newPath = pathToString(path) + '/'; // add trailing slash

                item.find('[data-path]').each(function(i, inner){
                    var inner = $(inner);
                    var path = inner.attr('data-path')
                    .replace(currentPath, newPath); // this will only replace the first replacement found
                    inner.attr('data-path', path);
                });

                item.attr('data-path', newPath);
            });
        };

        var isNumeric = function(obj) {
            return !isNaN(obj - parseFloat(obj));
        };

        return {
            'pathToString': pathToString,
            'stringToPath': stringToPath,
            'getData': getData,
            'deleteData': deleteData,
            'getParentData': getParentData,
            'updatePaths': updatePaths,
        };
    })();
    rr.Validation = (function(){
        // Error messages
        var addErrorMessage = function(field, error) {
            $(field).find('.field').addClass('error');
            $(field).parent().append('' +
                '<p class="error-message"><span>' + error + '</span></p>');
            console.log('Error found!', error);
        };


        var validate = function(fields) {
            var flagged = 0;
            $('.error').removeClass('error');
            $('.error-message').remove();

            fields.each(function(i, field) {
                var isRequired = $(field).attr('data-required') == 'required';
                var value = field.value;

                if (isRequired && !value) {
                    addErrorMessage(field, 'Dit veld is verplicht.');
                    flagged++;
                } else if (!value) {
                    // do nothing: not required, not filled in;
                } else  {
                    // there is a value, yeey! let's validate now
                    if (field.hasAttribute('email')) {
                        if (!validateEmail(field.value)){
                            addErrorMessage(field, 'Zorg ervoor dat er een correct e-mailadres is ingevuld.');
                            flagged++;
                        }
                    }
                    if (field.hasAttribute('min') && field.min != '') {
                        if (!validateMinInteger(field.value, field.min)){
                            addErrorMessage(field, 'Zorg ervoor dat deze waarde minstens ' + field.min + ' is.');
                            flagged++;
                        }
                    }
                    if (field.hasAttribute('max') && field.max != '') {
                        if (!validateMaxInteger(field.value, field.max)){
                            addErrorMessage(field, 'Zorg ervoor dat deze waarde hoogstens ' + field.max + ' is.');
                            flagged++;
                        }
                    }
                    if (field.type == 'checkbox') {
                        $(field).attr('value', $(field).is(":checked"));
                    }
                }
            });

            return flagged == 0;
        };

        /* Value Validations */

        var validateEmail = function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        var validateMinInteger = function(value, min) {
            return parseInt(value) >= parseInt(min);
        };

        var validateMaxInteger = function(value, max) {
            return parseInt(value) <= parseInt(max);
        };
        
        /* rr.Validation Filters */

        var emailFilter = function(fields) {
            var flagged = 0;

            fields.each(function(i, field) {
                if (field.value) {
                    if (!validateEmail(field.value)){
                        addErrorMessage(field, 'Zorg ervoor dat er een correct e-mailadres is ingevuld.');
                        flagged++;
                    }
                }
            });

            return flagged;
        };

        var minValidation = function(fields) {
            var flagged = 0;

            fields.each(function(i, field) {
                if (field.value) {
                    if (!validateMinInteger(field.value, field.min)){
                        addErrorMessage(field, 'Zorg ervoor dat deze waarde minstens ' + field.min + ' is.');
                        flagged++;
                    }
                }
            });

            return flagged;
        };

        var maxValidation = function(fields) {
            var flagged = 0;

            fields.each(function(i, field) {
                if (field.value) {
                    if (!validateMaxInteger(field.value, field.max)){
                        addErrorMessage(field, 'Zorg ervoor dat deze waarde hoogstens ' + field.max + ' is.');
                        flagged++;
                    }
                }
            });

            return flagged;
        };

        return {
            'validate': validate,
            'addErrorMessage': addErrorMessage,
        };
    })();
    this.init(data);
    return this;
};
