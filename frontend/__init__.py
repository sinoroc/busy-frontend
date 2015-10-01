""" Module initializer
"""


import celery
import logging
import pyramid
import zope


LOG = logging.getLogger(__name__)


@pyramid.events.subscriber(pyramid.events.NewRequest)
def print_request_headers(event):
    """ Print headers of new incoming requests.
    """
    LOG.error("{} {}".format(event.request.method, event.request.path_qs))
    return None


@pyramid.view.view_config(route_name='web_home', renderer='frontend:templates/web_home.pt')
def web_home_view(request):
    LOG.error("web_home_view")
    return {}


@pyramid.view.view_config(route_name='rest_foo', request_method='POST', renderer='json')
def rest_foo_post(request):
    arg = request.json_body['arg']
    subtask = celery.signature('business.tasks.foo', args=(arg,))
    callback = celery.signature('business.tasks.foo_callback')
    async_result_uid = getattr(subtask.apply_async(link=callback), 'id')
    return {
        'async_result': async_result_uid,
    }


@pyramid.view.view_config(route_name='rest_foos', request_method='POST', renderer='json')
def rest_foos_post(request):
    status = []
    async_result_uids = request.json_body

    celery_app = request.registry.queryUtility(ICeleryApp)
    for async_result_uid in async_result_uids:
        async_result = celery.result.AsyncResult(async_result_uid, app=celery_app)
        status.append({
            'uid': async_result_uid,
            'status': async_result.status,
        })

    return {
        'status': status,
    }


class ICeleryApp(zope.interface.Interface):
    pass


def main(dummy_global_config, **settings):
    """ Make the Pyramid WSGI application.
    """

    config = pyramid.config.Configurator(
        settings=settings,
    )

    config.include('pyramid_chameleon')

    config.add_route('web_home', '/')
    config.add_route('rest_foo', '/foo')
    config.add_route('rest_foos', '/foos')

    config.add_static_view(name='js', path='js')

    celery_app = celery.Celery('business.tasks', backend='redis://redis')

    config.registry.registerUtility(celery_app, ICeleryApp)

    config.scan()
    return config.make_wsgi_app()


# EOF
