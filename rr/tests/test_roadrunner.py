# -*- coding: utf-8 -*-
import unittest

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase, override_settings

# from django.urls import reverse

from rr.templatetags.styling_tags import get_styling
from rr.blocks.bootstrap import AccordionBlock
from rr.edit_handlers import RoadRunnerPanel
from rr .fields import RoadRunnerField


@unittest.skip("These tests are for the former version")
@override_settings(INSTALLED_APPS=settings.INSTALLED_APPS + ["roadrunner"])
class RoadRunnerTest(TestCase):
    fixtures = ["roadrunner"]

    def login(self):
        # Create a user
        user = get_user_model().objects.get(pk=1)
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

    def test_get_uuid(self):
        block = AccordionBlock()
        self.assertIsNotNone(block.get_uuid())

    def test_road_runner_field(self):
        field = RoadRunnerField([])
        panel = field.get_panel()
        self.assertEqual(panel, RoadRunnerPanel)
