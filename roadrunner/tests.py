# -*- coding: utf-8 -*-
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase
from django.urls import reverse

from .templatetags.styling_tags import get_styling
from .blocks import AccordionBlock
from .edit_handlers import RoadRunnerPanel
from .fields import RoadRunnerField
from .wagtail_hooks import css, js, wagtail


class RoadRunnerTest(TestCase):
    fixtures = ["roadrunner.json"]

    def login(self):
        # Create a user
        user = get_user_model().objects._create_user(  # pylint: disable=W0212
            username="test2",
            email="test2@email.com",
            password="password",
            is_staff=True,
            is_superuser=True,
        )  # pylint: disable=W0212
        user.groups.add(Group.objects.get(pk=2))
        # Login
        self.client.login(username="test2", password="password")
        return user

    def setUp(self):
        self.login()

    def test_styling_tags(self):
        styling = {"height": "50px", "width": ""}
        styling_attribute = get_styling(styling)
        styling_attribute_no_tag = get_styling(styling, True)
        self.assertEqual(styling_attribute, 'style="height: 50px;"')
        self.assertEqual(styling_attribute_no_tag, "height: 50px;")

    def test_media(self):
        self.assertIsNotNone(css())
        self.assertIsNotNone(js())
        self.assertIsNotNone(wagtail())

    def test_get_uuid(self):
        block = AccordionBlock()
        self.assertIsNotNone(block.get_uuid())

    def test_road_runner_field(self):
        field = RoadRunnerField([])
        panel = field.get_panel()
        self.assertEqual(panel, RoadRunnerPanel)

    def test_image_view(self):
        url = reverse("roadrunner:image")
        response = self.client.get(url)
        self.assertFalse(response.json())
        response = self.client.get(url, {"id": 1})
        self.assertNotEqual(response.json(), False)

    def test_page_view(self):
        url = reverse("roadrunner:page")
        response = self.client.get(url)
        self.assertFalse(response.json())
        response = self.client.get(url, {"id": 1})
        self.assertNotEqual(response.json(), False)

    def test_document_view(self):
        url = reverse("roadrunner:document")
        response = self.client.get(url)
        self.assertFalse(response.json())
        response = self.client.get(url, {"id": 1})
        self.assertNotEqual(response.json(), False)
