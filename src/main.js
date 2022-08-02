/* 
 * Copyright (C) 2022 CLARIN
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { VCRIntegration } from './VCRIntegration.js';
import { VCRIntegrationEventHandler } from './VCRIntegrationEventHandler.js';
import { SETTING_LOGLEVEL, SETTING_NO_INIT } from './Constants.js';

import $ from 'jquery';
import logger from 'loglevel';

const global = this || window;

const initPlugin = function (config) {
    let configuration = config || {};
    if (configuration[SETTING_LOGLEVEL]) {
        logger.setLevel(configuration[SETTING_LOGLEVEL]);
        logger.info('Log level set from configuration:', configuration[SETTING_LOGLEVEL]);
    }

    logger.info('Initialising VCR integration with configuration', configuration);

    let vcrIntegration = new VCRIntegration(configuration);
    registerEventHandlers(vcrIntegration);

    let queue = vcrIntegration.getQueue();
    if (queue) {
        vcrIntegration.renderQueue();
    }

    global.vcrIntegration = vcrIntegration;
    return vcrIntegration;
};
global.initVcrIntegration = initPlugin;

const registerEventHandlers = function (vcrIntegration) {
    const eventHandler = new VCRIntegrationEventHandler(vcrIntegration);

    $("body").on("click", "#queue-component #clearVcrQueue", $.proxy(eventHandler.handleClearQueueEvent, eventHandler));
    $("body").on("click", "#queue-component li[data-vcr-url] a.removeFromVcrQueue", $.proxy(eventHandler.handleRemoveFromQueueEvent, eventHandler));
    $("body").on("click", "#queue-component .component-control-hide-toggle", $.proxy(eventHandler.handleVcrQueueMinimizedToggle, eventHandler));

    // if auto registration of handlers enabled
    if ($("a[data-vcr-url]").length) {
        logger.debug("Found one or more VCR queue item controls: " + $("a[data-vcr-url]").length);

        // TODO: render 'add to queue' buttons where placeholders are defined

        // bind event to add to queue
        $("body").on("click", "a[data-vcr-url]", $.proxy(eventHandler.handleAddToQueueEvent, eventHandler));
    }
};

logger.setLevel(logger.levels.INFO);
// init when document ready
$(document).ready(function () {
    let config = global.vcrIntegrationConfiguration;
    if (config) {
        if (config[SETTING_NO_INIT] === true) {
            logger.warn("Configuration property", SETTING_NO_INIT, "set to true - skipping initalisation of VCR integration");
        } else {
            initPlugin(config);
        }
    } else {
        initPlugin(null);
    }
});