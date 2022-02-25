# "Extend the site so that each post has a "hits" or "viewed" counter
# on it that displays how many times said post has been viewed at the bottom of the post."

# I thought I'd take this opportunity to get a little creative with the solution and make it so
# that our hits counter only increments once per day per unique visitor using server-side cookies and sessions.
from django.http.response import Http404
from .models import Post
from django.http import HttpResponse
from django.shortcuts import render

from datetime import datetime, timedelta        # to check that a full day has passed before increment
import hashlib                                  # to give a unique cookie name per blog post

def index(request):
    latest_blog_posts = Post.objects.order_by('-posted_at')[:5]
    return render(request, 'blog/index.html', {'latest_blog_posts': latest_blog_posts})

def detail(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        raise Http404("Post with given ID does not exist")
    visitor_cookie_handler(request, post)
    return render(request, 'blog/detail.html', {'post': post})

# a helper method to get the server side cookie or return a default value. I set this default value to the current date
# minus 2 days; if the default value triggered it is considered a new visit.
def get_server_side_cookie(request, cookie, default_val=None):
    val = request.session.get(cookie)
    if not val:
        val = default_val
    return val

def visitor_cookie_handler(request, post):
    cookie_name = 'last_visit%s' % hashlib.md5(request.path.encode('utf-8')).hexdigest()    # create a unique last_visit cookie per blog post
    last_visit_cookie = get_server_side_cookie(request, cookie_name, str(datetime.now()-timedelta(days=2)))    # initialize server side cookie; if cookie doesn't exist, consider it a new visit
    last_visit_time = datetime.strptime(last_visit_cookie[:-7], '%Y-%m-%d %H:%M:%S')
    if(datetime.now() - last_visit_time).days > 0:  # if it's been more than a day since last visit
        post.visits += 1              # increment visit
        post.save(new_visit=True)     # updated save override to take this flag so that our 'edited_at' value is not overwritten
        request.session[cookie_name] = str(datetime.now())  # set new time
    else:
        request.session[cookie_name] = last_visit_cookie
