# Looks like this issue has a few layers. Currently, our datetime storage is timezone naive
# which doesn't mix well with django's default timezone aware objects such as the auto_now field.
# It seems like an attempt was made to override auto_now to convert utc to localtime, however this
# is not allowed by django. My first thought would be to store all times as timezone aware UTC in django then use
# javascript to display client-side times in their local time, though this may be beyond the scope of
# this bug and the pytest. For now, I will implement a band-aid fix that stores our dates as local times.

from django.db import models
from django.utils import timezone

# Removed auto_now "override"

class Post(models.Model):
    title = models.CharField(max_length=128)
    text = models.TextField(max_length=2048)
    posted_by = models.CharField(max_length=50, default="root")
    posted_at = models.DateTimeField(editable=False)    # "auto-fill" moved to save() override
    edited_at = models.DateTimeField(editable=False)    # editable=False from auto_now, but this time without the UTC confusion.
    visits = models.IntegerField(default=0, editable=False)

    def __str__(self):
        return self.title

    # @param new_visit: Boolean value representing a unique blog post visit
    def save(self, new_visit=False, *args, **kwargs):
        if not self.id:                                     # on create, set posted time to current time
            self.posted_at = timezone.now().astimezone()
        if not new_visit:                                   # to ensure edited_at isn't overwritten on new visit
            self.edited_at = timezone.now().astimezone()        # on update, set edit time to current time
        return super(Post, self).save(*args, **kwargs)
