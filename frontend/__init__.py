""" Module initializer
"""


import celery
import logging
import pyramid


LOG = logging.getLogger(__name__)


@pyramid.events.subscriber(pyramid.events.NewRequest)
def print_request_headers(event):
    """ Print headers of new incoming requests.
    """
    LOG.error("{} {}".format(event.request.method, event.request.path_qs))
    return None


@pyramid.view.view_config(route_name='web_home', renderer='json')
def web_home_view(request):
    LOG.error("web_home_view")
    subtask = celery.signature('business.tasks.foo', args=(3,))
    callback = celery.signature('business.tasks.foo_callback')
    subtask.apply_async(link=callback)
    return {'ping': 'pong'}


def main(dummy_global_config, **settings):
    """ Make the Pyramid WSGI application.
    """

    config = pyramid.config.Configurator(
        settings=settings,
    )

    config.add_route('web_home', '/')

    config.scan()
    return config.make_wsgi_app()


# EOF
