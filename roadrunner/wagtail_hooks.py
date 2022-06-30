from wagtail.core import hooks


@hooks.register("register_icons")
def register_roadrunner_icons(icons):
    icons.extend(
        [
            "roadrunner/icons/laptop.svg",
            "roadrunner/icons/mobile.svg",
            "roadrunner/icons/palette.svg",
            "roadrunner/icons/tablet.svg",
            "roadrunner/icons/tv.svg",
            "roadrunner/icons/layout.svg",
            "roadrunner/icons/button.svg",
            "roadrunner/icons/product.svg",
            "roadrunner/icons/richtext.svg",
        ]
    )
    return icons
