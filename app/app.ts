import { Application } from '@nativescript/core';
import { androidLaunchEventLocalizationHandler } from '@nativescript/localize';
import { AudioHelper } from './shared/audio-helper';
import { localize } from './shared/locale-manager';

Application.on(Application.launchEvent, (args) => {
    if (args.android) {
        androidLaunchEventLocalizationHandler();
    }
    AudioHelper.init();
});

// Register localize function as 'L' resource for XML data binding
Application.setResources({ L: localize });

Application.run({ moduleName: 'app-root' });
