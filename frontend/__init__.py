""" Module initializer
"""


import logging
import pyramid


LOG = logging.getLogger(__name__)


@pyramid.events.subscriber(pyramid.events.NewRequest)
def print_request_headers(event):
    """ Print headers of new incoming requests.
    """
    LOG.error("{} {}".format(event.request.method, event.request.path_qs))
    return None


@pyramid.view.view_config(route_name='web_home', renderer='frontend:templates/web_home.pt')
def web_home_view(request):
    return {}


def main(dummy_global_config, **settings):
    """ Make the Pyramid WSGI application.
    """

    config = pyramid.config.Configurator(
        settings=settings,
    )

    config.include('pyramid_chameleon')

    config.add_route('web_home', '/')
    config.add_static_view(name='js', path='js')

    config.scan()
    return config.make_wsgi_app()


# EOF
