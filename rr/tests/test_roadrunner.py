# -*- coding: utf-8 -*-
import unittest

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.template.loader import get_template
from django.test import TestCase, override_settings

from rr.blocks.main import RoadRunnerBaseBlock
from rr.templatetags.styling_tags import get_styling


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

    def test_column_grid_class_output(self):
        # GridChoiceBlock stores its value as a space-joined string. Wagtail 7.4
        # changed MultipleChoiceBlock.to_python to wrap non-list values in a
        # list (PR #13658), so the grid rendered as class="['col-12']" instead
        # of class="col-12". This pins the plain-string output in rr/row.html.
        block = RoadRunnerBaseBlock()
        value = block.to_python(
            {"grid": "col-12 col-md-6", "content": [], "styling": {}}
        )
        rendered = get_template("rr/row.html").render({"row": [value]})
        self.assertIn('class="col-12 col-md-6 ', rendered)
        self.assertNotIn("['col-12", rendered)
        self.assertNotIn("[&#x27;", rendered)
