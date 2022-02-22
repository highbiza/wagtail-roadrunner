def fix_json(obj, image_keys=("image",)):
    """
    Repair json where image id's where saved as string instead of a number
    >>> data = [
    ...      {
    ...        "type": "fixed_width",
    ...        "value": [
    ...          {
    ...            "title": "een voorbeeld",
    ...            "grid": " col-xs-12 col-sm-12 col-md-12 col-lg-12",
    ...            "content": [
    ...              {
    ...                "type": "header",
    ...                "value": {
    ...                  "heading_type": "h1",
    ...                  "text": "De homepage van uw nieuwe site",
    ...                  "styling": {
    ...                    "margin": "my-3",
    ...                    "padding": "",
    ...                    "border": "",
    ...                    "border_radius": "",
    ...                    "background_color": "",
    ...                    "color": "",
    ...                    "font_size": "",
    ...                    "text_align": "",
    ...                    "block_classes": ""
    ...                  }
    ...                }
    ...              },
    ...              {
    ...                "type": "text",
    ...                "value": {
    ...                  "text": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis.",
    ...                  "styling": {
    ...                    "margin": "my-3",
    ...                    "padding": "",
    ...                    "border": "",
    ...                    "border_radius": "",
    ...                    "background_color": "",
    ...                    "color": "",
    ...                    "font_size": "",
    ...                    "text_align": "",
    ...                    "block_classes": ""
    ...                  }
    ...                }
    ...              },
    ...              {
    ...                "type": "image",
    ...                "value": {
    ...                  "image": "27",
    ...                  "alt": "",
    ...                  "styling": {
    ...                    "margin": "",
    ...                    "padding": "",
    ...                    "border": "",
    ...                    "border_radius": "",
    ...                    "background_color": "",
    ...                    "color": "",
    ...                    "font_size": "",
    ...                    "text_align": "",
    ...                    "block_classes": ""
    ...                  }
    ...                }
    ...              }
    ...            ],
    ...            "styling": {
    ...              "margin": "",
    ...              "padding": "",
    ...              "border": "",
    ...              "border_radius": "",
    ...              "background_color": "",
    ...              "color": "",
    ...              "font_size": "",
    ...              "text_align": "",
    ...              "block_classes": ""
    ...            }
    ...          }
    ...        ],
    ...        "id": "3b56712a-ec82-4368-8be4-3a18da5aaef7"
    ...      }
    ...    ]
    >>> fix_json(data)
    [{'type': 'fixed_width', 'value': [{'title': 'een voorbeeld', 'grid': ' col-xs-12 col-sm-12 col-md-12 col-lg-12', 'content': [{'type': 'header', 'value': {'heading_type': 'h1', 'text': 'De homepage van uw nieuwe site', 'styling': {'margin': 'my-3', 'padding': '', 'border': '', 'border_radius': '', 'background_color': '', 'color': '', 'font_size': '', 'text_align': '', 'block_classes': ''}}}, {'type': 'text', 'value': {'text': 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis.', 'styling': {'margin': 'my-3', 'padding': '', 'border': '', 'border_radius': '', 'background_color': '', 'color': '', 'font_size': '', 'text_align': '', 'block_classes': ''}}}, {'type': 'image', 'value': {'image': 27, 'alt': '', 'styling': {'margin': '', 'padding': '', 'border': '', 'border_radius': '', 'background_color': '', 'color': '', 'font_size': '', 'text_align': '', 'block_classes': ''}}}], 'styling': {'margin': '', 'padding': '', 'border': '', 'border_radius': '', 'background_color': '', 'color': '', 'font_size': '', 'text_align': '', 'block_classes': ''}}], 'id': '3b56712a-ec82-4368-8be4-3a18da5aaef7'}]

    >>> data = [
    ...      {
    ...        "type": "fixed_width",
    ...        "value": [
    ...          {
    ...            "title": "een voorbeeld",
    ...            "grid": " col-xs-12 col-sm-12 col-md-12 col-lg-12",
    ...            "content": [
    ...              {
    ...                "type": "header",
    ...                "value": {
    ...                  "heading_type": "h1",
    ...                  "text": "De homepage van uw nieuwe site",
    ...                  "styling": {
    ...                    "margin": "my-3",
    ...                    "padding": "",
    ...                    "border": "",
    ...                    "border_radius": "",
    ...                    "background_color": "",
    ...                    "color": "",
    ...                    "font_size": "",
    ...                    "text_align": "",
    ...                    "block_classes": ""
    ...                  }
    ...                }
    ...              },
    ...              {
    ...                "type": "text",
    ...                "value": {
    ...                  "text": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis.",
    ...                  "styling": {
    ...                    "margin": "my-3",
    ...                    "padding": "",
    ...                    "border": "",
    ...                    "border_radius": "",
    ...                    "background_color": "",
    ...                    "color": "",
    ...                    "font_size": "",
    ...                    "text_align": "",
    ...                    "block_classes": ""
    ...                  }
    ...                }
    ...              },
    ...              {
    ...                "type": "image",
    ...                "value": {
    ...                  "klaas": "27",
    ...                  "alt": "",
    ...                  "styling": {
    ...                    "margin": "",
    ...                    "padding": "",
    ...                    "border": "",
    ...                    "border_radius": "",
    ...                    "background_color": "",
    ...                    "color": "",
    ...                    "font_size": "",
    ...                    "text_align": "",
    ...                    "block_classes": ""
    ...                  }
    ...                }
    ...              }
    ...            ],
    ...            "styling": {
    ...              "margin": "",
    ...              "padding": "",
    ...              "border": "",
    ...              "border_radius": "",
    ...              "background_color": "",
    ...              "color": "",
    ...              "font_size": "",
    ...              "text_align": "",
    ...              "block_classes": ""
    ...            }
    ...          }
    ...        ],
    ...        "id": "3b56712a-ec82-4368-8be4-3a18da5aaef7"
    ...      }
    ...    ]
    >>> image_keys = ("klaas", "image",)
    >>> fix_json(data, image_keys)
    [{'type': 'fixed_width', 'value': [{'title': 'een voorbeeld', 'grid': ' col-xs-12 col-sm-12 col-md-12 col-lg-12', 'content': [{'type': 'header', 'value': {'heading_type': 'h1', 'text': 'De homepage van uw nieuwe site', 'styling': {'margin': 'my-3', 'padding': '', 'border': '', 'border_radius': '', 'background_color': '', 'color': '', 'font_size': '', 'text_align': '', 'block_classes': ''}}}, {'type': 'text', 'value': {'text': 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis.', 'styling': {'margin': 'my-3', 'padding': '', 'border': '', 'border_radius': '', 'background_color': '', 'color': '', 'font_size': '', 'text_align': '', 'block_classes': ''}}}, {'type': 'image', 'value': {'klaas': 27, 'alt': '', 'styling': {'margin': '', 'padding': '', 'border': '', 'border_radius': '', 'background_color': '', 'color': '', 'font_size': '', 'text_align': '', 'block_classes': ''}}}], 'styling': {'margin': '', 'padding': '', 'border': '', 'border_radius': '', 'background_color': '', 'color': '', 'font_size': '', 'text_align': '', 'block_classes': ''}}], 'id': '3b56712a-ec82-4368-8be4-3a18da5aaef7'}]
    """
    if isinstance(obj, tuple):
        key, value = obj
        if key in image_keys:
            try:
                return int(value)
            except (ValueError, TypeError):
                pass
        return fix_json(value, image_keys)
    elif isinstance(obj, list):
        return [fix_json(o, image_keys) for o in obj]
    elif isinstance(obj, dict):
        return {key: fix_json((key, value), image_keys) for key, value in obj.items()}
    return obj
