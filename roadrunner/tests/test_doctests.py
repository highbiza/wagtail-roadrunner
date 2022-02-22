import doctest

import roadrunner.utils


def load_tests(loader, tests, ignore):  # pylint: disable=W0613
    tests.addTests(doctest.DocTestSuite(roadrunner.utils))
    return tests
