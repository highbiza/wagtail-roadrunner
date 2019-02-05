var columns = [
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
    $('<div class="column"></div>'),
];
var sizes = [
    $('<div class="size xs"></div>'),
    $('<div class="size sm"></div>'),
    $('<div class="size md"></div>'),
    $('<div class="size lg"></div>'),
];

var setColumns = function() {
    var prefix = getPrefix();
    var size = selectedSize();
    var value = $('.rr_modal .size.' + size).attr('data-value');

    if (typeof value == 'undefined') {
        value = 'col-' + size + '-0';
    }

    if (value.indexOf('offset') == -1 ) {
        $('.rr_modal .column').slice(0,value.substr(prefix.length)).addClass('selected');
    } else {
        var offset = parseInt(value.split(' ')[1].substr(prefix.length + 'offset-'.length));
        var value = parseInt(value.split(' ')[0].substr(prefix.length)) + offset;
        $('.rr_modal .column').slice(0,offset).addClass('offset');
        $('.rr_modal .column').slice(0,value).addClass('selected');
    }
};

var getPrefix = function() {
    return 'col-' + selectedSize() + '-';
};

var selectedSize = function() {
    var size = $('.rr_modal .size.selected').attr('class')
    .replace('selected', '').replace('size', '').replace(/ /g, '');
    return size
};

var createGridChooser = function(name){
    var input = $('.rr_modal input[name=' + name + ']');

    var gridChooser = $('<div></div>')
    .addClass('grid-chooser')
    .attr('data-input', name);

    var sizeChooser = $('<div></div>')
    .addClass('size-chooser')
    .attr('data-input', name);

    gridChooser.append(columns);
    sizeChooser.append(sizes);

    input.before(sizeChooser);
    input.before(gridChooser);

    var value = input.val();

    $('.rr_modal .column').removeClass('selected').removeClass('offset');

    var splitted = value.trim().split(' ');

    $('.rr_modal .size').each(function(){
        $(this).removeAttr('data-value');
        $(this).removeClass('selected');
    });
    $('.rr_modal .size.xs').addClass('selected');

    if (splitted[0] != "" && splitted.length > 0) {
        for (i in splitted) {
            var split = splitted[i];
            var size = split.slice(4,6);
            var sizeNode = $('.rr_modal .size.' + size);
            var attr = sizeNode.attr('data-value');
            if (typeof(attr) == 'undefined') {
                sizeNode.attr('data-value', split);
            } else if (attr.indexOf(split) == -1) {
                sizeNode.attr('data-value', attr + ' ' + split);
            }
        }
        setColumns();
    }
};

$(document).on('click', '.column', function(){
    var name = $(this).parent().attr('data-input');
    var input = $('input[name=' + name + ']');
    var index = $(this).index() + 1;
    var prefix = getPrefix();
    var value = prefix + index;

    $('.rr_modal .column').removeClass('selected');
    $('.rr_modal .column').slice(0,index).addClass('selected');
    $('.rr_modal .offset:not(.selected)').removeClass('offset');
    if (index <= $('.offset').length ){
        $('.rr_modal .offset.selected:last').removeClass('offset');
    }

    input.val(calculateValue());
});

$(document).on('contextmenu', '.rr_modal .column', function(e){
    e.preventDefault();

    var offsets = $('.rr_modal .column.offset').length;
    var name = $(this).parent().attr('data-input');
    var input = $('input[name=' + name + ']');
    var index = $(this).index() + 1;

    $('.rr_modal .column').removeClass('offset');
    if ( index != offsets ) {
        if (index >= $('.rr_modal .column.selected').length) {
            index = $('.rr_modal .column.selected').length - 1;
        }
        $('.rr_modal .column').slice(0,index).addClass('offset');
    }

    input.val(calculateValue());
});

$(document).on('click', '.size', function(){
    $(this).siblings().removeClass('selected');
    $(this).addClass('selected');
});

$(document).on('click', '.modal .size', function(){
    $('.column').removeClass('selected').removeClass('offset');
    setColumns();
});

var calculateValue = function() {
    var prefix = getPrefix();
    var offset = $('.rr_modal .column.offset:last').index() + 1;
    var width = $('.rr_modal .column.selected:last').index() + 1;
    var value = prefix;

    if (offset == 0) {
        value += width;
    } else {
        value = prefix + (width - offset) + ' ' + prefix + 'offset-' + offset;
    }

    var size = selectedSize();
    $('.rr_modal .size.' + size).attr('data-value', value);

    var fullValue = '';
    $('.rr_modal .size-chooser .size[data-value]').each(function(){
        fullValue = fullValue + ' ' + $(this).attr('data-value');
    });

    return fullValue;
};

