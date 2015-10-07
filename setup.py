""" Module setup
"""


import os
import setuptools


NAME = 'frontend'

VERSION = '0.0.0'

REQUIRES = [
    'pyramid',
    'pyramid_chameleon',
    'waitress',
]

ENTRY_POINTS = """\
[paste.app_factory]
main = {}:main
""".format(NAME)


setuptools.setup(
    name=NAME,
    version=VERSION,
    packages=setuptools.find_packages(),
    install_requires=REQUIRES,
    include_package_data=True,
    entry_points=ENTRY_POINTS,
)


# EOF
