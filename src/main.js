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

import $ from 'jquery';
import logger from 'loglevel';

import { VCRIntegration } from './VCRIntegration.js';
import { VCRIntegrationEventHandler } from './VCRIntegrationEventHandler.js';
import { mergeWithDefaultConfig } from './Configuration.js';
// configuration properties
import {configProperties as cfp} from './Configuration.js';

const global = this || window;

const initPlugin = function (config) {
    let configuration = mergeWithDefaultConfig(config || {});
    if (configuration[cfp.SETTING_LOGLEVEL]) {
        logger.setLevel(configuration[cfp.SETTING_LOGLEVEL]);
        logger.info('Log level set from configuration:', configuration[cfp.SETTING_LOGLEVEL]);
    }

    logger.info('Initialising VCR integration with configuration', configuration);

    let vcrIntegration = new VCRIntegration(configuration);
    registerEventHandlers(vcrIntegration);

    if (vcrIntegration.getQueue()) {
        vcrIntegration.updatedAddLinkEnabledState();
        vcrIntegration.renderQueue();
    }

    global.vcrIntegration = vcrIntegration;
    return vcrIntegration;
};
global.initVcrIntegration = initPlugin;

const registerEventHandlers = function (vcrIntegration) {
    const eventHandler = new VCRIntegrationEventHandler(vcrIntegration);

    // Queue component events:
    // - Queue is submitted (as form)
    $("body").on("submit", "#queue-component form", $.proxy(eventHandler.handleOnSubmit, eventHandler));
    // - Clear button is clicked
    $("body").on("click", "#queue-component .clearVcrQueue", $.proxy(eventHandler.handleClearQueueEvent, eventHandler));
    // - Single item is removed
    $("body").on("click", "#queue-component li[data-vcr-uri] a.removeFromVcrQueue", $.proxy(eventHandler.handleRemoveFromQueueEvent, eventHandler));
    // - Hide/show action
    $("body").on("click", "#queue-component .component-control-hide-toggle", $.proxy(eventHandler.handleVcrQueueMinimizedToggle, eventHandler));
    // - Help button clicked
    $("body").on("click", "#queue-component .component-control-help", $.proxy(eventHandler.handleShowHelp, eventHandler));
    // - Alert/message is dismissed
    $("body").on("click", "#queue-component .alert .close", $.proxy(eventHandler.handleCloseWarning, eventHandler));

    // Modal dialogue events:
    // - Dialogue is dismissed
    $("body").on("click", '.vcr-modal button[data-dismiss="modal"]', (evt) => {
        $(evt.currentTarget).parents('.vcr-modal').detach();
    });

    // If auto registration of handlers enabled
    if ($("a[data-vcr-uri]").length > 0) {
        logger.debug("Found one or more VCR queue item controls: " + $("a[data-vcr-uri]").length);

        // TODO: render 'add to queue' buttons where placeholders are defined

        // bind event to add to queue
        $("body").on("click", "a[data-vcr-uri]", $.proxy(eventHandler.handleAddToQueueEvent, eventHandler));
    }
};

logger.setLevel(logger.levels.INFO);
// init when ready
$(() => {
    let config = global.vcrIntegrationConfiguration;
    if (config) {
        // allow for log level override through config
        if (config[cfp.SETTING_LOGLEVEL]) {
            logger.setLevel(config[cfp.SETTING_LOGLEVEL]);
        }
        // skip init?
        if (config[cfp.SETTING_AUTO_INIT] === false) {
            logger.info("Configuration property", cfp.SETTING_AUTO_INIT, "set to false - skipping initalisation of VCR integration");
        } else {
            initPlugin(config);
        }
    } else {
        initPlugin(null);
    }
});
