lintnode - a JSLint server for more expedient linting
=====================================================

This is a modification of the original lintnode which has all the non-core node dependencies removed.
So no need for express etc. Can be setup on windows if you have http://curl.haxx.se/curl for windows 

This is what my init.el looks like

::

 ;;lintnode
 (add-to-list 'load-path "~/.emacs.d/lintnode")
 (require 'flymake-jslint)
 (require 'flymake-cursor)
 (setq lintnode-location "~/.emacs.d/lintnode")
 ;; JSLint can be... opinionated
 (setq lintnode-jslint-excludes (list 'nomen 'undef 'plusplus 'onevar 'white))
 ;; Start the server when we first open a js file and start checking
 (add-hook 'js2-mode-hook
           (lambda ()
             (lintnode-hook))) 

I use this js2-mode, there are a lot of variants but this one indents properly
https://github.com/mooz/js2-mode/blame/master/js2-mode.el

:Now Original readme continues...:


(Original I) was setting up `flymake-mode`_ with JSLint_, and thinking it was
pretty great, but that rhino start-up cost is pretty big for a flymake
application.  If we just kept JSLint running, wouldn't that be a lot
faster?

Then (Original guy) caught a talk on the `node.js`_ server, and saw a way.

In (Original guys) environment, this cuts jslint invocation time in half.

The ``jslint.curl`` script depends on curl, but you can easily
reproduce it with any other http client.

.. _flymake-mode: http://www.emacswiki.org/emacs/FlymakeJavaScript
.. _JSLint: http://www.jslint.com/
.. _node.js: http://nodejs.org/


Usage
-----

::

  $ node lintnode/app.js --port 3003 &
  Express started at http://localhost:3003/ in development mode

  $ lintnode/jslint.curl myfilthycode.js

The exit code of ``jslint.curl`` is currently not nearly as relevant
as the output on standard out.  The output should be fully compatible
with `JSLint's Rhino version`__.

.. __: http://www.jslint.com/rhino/


Emacs Usage
-----------

See the included `flymake-jslint.el`__.

.. __: flymake-jslint.el


Configuration
-------------

`jslint_port` may be passed on the node command line with the
``--port`` parameter.  It defaults to 3003.

`jstlint_options` is currently only configurable by editing
``app.js``.  For documentation on JSLint's options, see `JSLint
options`_.

.. _JSLint options: http://www.jslint.com/lint.html#options


Support
-------

This project is hosted at github, which has a wiki and an issue tracker:

  http://github.com/keturn/lintnode


License
-------

This software is distributed under the same license__ as JSLint, which
looks like the MIT License with one additional clause:

  The Software shall be used for Good, not Evil.

.. __: LICENSE
