import doctest

import rr.utils


def load_tests(loader, tests, ignore):  # pylint: disable=W0613
    tests.addTests(doctest.DocTestSuite(rr.utils))
    return tests
