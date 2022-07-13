## Overview

Dismissibles create a behavior for the content being displayed that allows users to click a close button and hide the content within.

## Description

The dismissible component will initially be used for "pushdown" banner announcements on the homepage. The implementation, however, has been generalized so that any content can be added to a dismissible component, and hidden by the user from the page.

A simple javascript enhancement is available that will store the dismissal state of any given content between page loads and browser sessions.

The following variables are available:

`content`: The content within the dismissible. It is markup agnostic. The close button will appear over the top right corner.
