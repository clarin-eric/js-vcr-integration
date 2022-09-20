# Javascript library for Virtual Collection Registry integrations

Widget and API for easy integration with the [Virtual Collection Registry](https://collections.clarin.eu) (VCR)

![Build and test workflow](https://github.com/clarin-eric/js-vcr-integration/actions/workflows/webpack.yml/badge.svg?branch=main)
![Release](https://github.com/clarin-eric/js-vcr-integration/actions/workflows/release.yml/badge.svg?branch=main)
![Documentation](https://github.com/clarin-eric/js-vcr-integration/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main)

## Main features

* Queueing of items (with URL/PID, title and description) for submission to the VCR
* Submission queue component with listing and submit, clear, hide/show controls
* Declarative integration (no custom JS code required)
* Optional programmatic control of queue and queue component
* Style can be partially or fully overridden

## Usage

Load the script in the `<head>` section of an HTML document:
```html
<script type="text/javascript" defer="defer" src="https://collections.clarin.eu/script/vcr-integration/v1/vcr-integration.js"></script>
```

Define and annotate links for adding items to the queue:
```html
Some resource
    (<a  data-vcr-uri="http://doi.org/10.5555/12345678" 
    data-vcr-label="Some resource">Add to virtual collection</a>)
(...)
Other resource 
    (<a  data-vcr-uri="https://tinyurl.com/my-resource" 
    data-vcr-label="Some other resource"
    data-vcr-description="Optional description for the resource">Add to virtual collection</a>)
```

That is it. If a user clicks one of the annotated links a queue component will appear, allowing the user to manage the
queue (i.e. remove items or clear the entire queue) and eventually submit the queue to the Virtual Collection Registry.

See the [example page](./dist/example.html) for a full integration example.

### Requirements

The current version of the library assumes the availability of a number of CSS style definitions from
[Bootstrap 3.x](https://getbootstrap.com/docs/3.4/). 

If these definitions are not available, this will affect the behaviour and appearance of the controls provided by the library. 
It is therefore recommended to include the following if your page, site or application doesn't already use this version of
Bootstrap:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">
```

Alternatively, to avoid clashes with further styling, you may also use a tool such SASS or LESS to import the bootstrap classes
within the context of the `.vcr-plugin` class (see section on customisation below).

For more information, see the [Bootstrap 3.4 documentation](https://getbootstrap.com/docs/3.4/getting-started/).

There are no external Javascript dependencies.

### Programmatic control

After initalisation, a control object becomes available as `window.vcrIntegration`. It exposes an API that is
[separately documented](https://clarin-eric.github.io/js-vcr-integration/VCRIntegration.html). Actions include queue
item addition and removal, hiding and showing of the queue component, and changing any of the configuration properties
(see below).

## Configuration

**Optionally** a configuration object can be defined in the `<head>` section and made available for use by the library 
by assigning it to `window.vcrIntegrationConfiguration`:
```html
<script script type="text/javascript">
    window.vcrIntegrationConfiguration = {
        'queueControlPosition': 'bottom-right'
    };
</script>
```

Configuration options can also be set at runtime via the `setConfiguration` method. For instance:
```js
window.vcrIntegration.setConfiguration({
  'maxItemCount': 2
}, true);
```

The boolean option at the end causes a merge, rather than an override of the full configuration object. Note that configuration changes are not automatically applied; re-rendering may be needed, and some options are only applied upon initalisation.

### Supported configuration options

See also [Configuration.js](./src/Configuration.js).

#### Integration with VCR service:
* `endpointUrl`: Base URL of the Virtual Collection endpoint.
  * Defaults to `https://collections.clarin.eu/submit/extensional`.
* `maxItemCount`: The maximum number of items to allow in the queue.
  * Defaults to `100`.
* `defaultName`: Default name for a new collection.
  * Leave unconfigured for not passing any collection name.

#### Behaviour:
* `logLevel`: Log level for console output 
  * Value must be one of `debug`, `info`, `warn` or `silent`; see [loglevel](https://github.com/pimterry/loglevel).
  * Defaults to `info`.
* `autoInitialize`: Set to `false` to disable automatic initialisation of the plugin.
  * Doing this renders the plugin inactive until programatically activated with a call to `window.initVcrIntegration()`.
  * Defaults to `true`
* `autoDisableAddedItemLinks`: If set to true, links/buttons with the VCR data attributes will automatically be enabled or disabled upon changes in the queue, reflecting the presence of the referenced item in it.
  * Defaults to `true`.

#### Appearance and customisation:
* `queueControlPosition`: Position for rendering the queue component.
  * One of `top-right`, `bottom-right`, `bottom-left` or `top-left`.
  * Defaults to `bottom-right`.
* `icons`: Can be used to pass an array that defines markup for icons to replace the default icons. See `Icons.js`.
for a list of properties.
  * Leave unconfigured to use the default icon markup.
* `customQueueComponentClass`: Name for a class that is added to the queue component's root element for customisation purposes.
  * Leave unconfigured for no additional custom class.

## Customisation

### CSS

CSS can be used to override default style including colours, fonts, sizes, margins etc. A container element with class `.vcr-plugin` is rendered. Within this, there may be an element with id `#queue-component`. If the configuration option `customQueueComponentClass` is set (see above) the specified class is added to this element. Using this, one can override any properties. For instance, assuming `{customQueueComponentClass: 'my-customisation'}`:

```css
.vcr-plugin #queue-component.my-customisation {
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  color: purple;
}

.vcr-plugin #queue-component.my-customisation ul.queue-items {
  list-style-type: '🎉';
}
```

### Icons

Custom icons can be configured via the `icons` configuration option (see above). For example:
```js
window.vcrIntegration.setConfiguration({
  'icons': {
    'hide': '[H]',
    'show': '[S]',
    'remove': '[X]',
    'itemUrlLink': '[i]',
    'help': '[?]'
    }
  }, true);
```
Keep in mind that any icons NOT included in the override will not be rendered at all! For a full list of keys, see [Icons.js](src/Icons.js).