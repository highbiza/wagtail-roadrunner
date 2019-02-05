# Always prefer setuptools over distutils
from setuptools import setup, find_packages

# To use a consistent encoding
import codecs
from os import path

here = path.abspath(path.dirname(__file__))

# Get the long description from the README file
with codecs.open(path.join(here, "README.md"), encoding="utf-8") as f:
    long_description = f.read()

extras_require: dict = {
    "test": [
        "empty_testproject",
        "pylint-django",
        "black",
        "vdt.versionplugin.wheel",
        "coverage",
        "ocyan.plugin.wagtail",
    ]
}

setup(
    name="roadrunner",
    version="2.1.1",
    description="RoadRunner",
    long_description=long_description,
    url="https://gitlab.com/uwkm-frets/RoadRunner",
    branch_url="https://gitlab.com/uwkm-frets/RoadRunner/tree/master",
    download_url="https://gitlab.com/uwkm-frets/RoadRunner/repository/archive.zip",
    author="UWKM",
    author_email="support@uwkm.nl",
    license="MIT",
    include_package_data=True,
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Framework :: Django :: 2.0",
        "Framework :: Django :: 2.1",
        "Framework :: Django :: 2.2",
        "Framework :: Wagtail :: 2",
    ],
    keywords="RoadRunner",
    install_requires=["wagtail", "wagtailfontawesome"],
    extras_require=extras_require,
)
