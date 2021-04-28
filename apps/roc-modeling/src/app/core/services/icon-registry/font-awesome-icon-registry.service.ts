import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FaConfig, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBookmark as faBookmarkLight, faCopy, faHeart as faHeartLight, faSync, faTimes } from '@fortawesome/pro-light-svg-icons';
import { faArrowRight, faBookmark, faCheck, faClone, faCompressArrowsAlt, faExpandArrowsAlt, faHeart, faLockAlt, faPencilAlt, faPlus, faRedoAlt, faShareSquare, faTimes as faTimesSolid, faTrash } from '@fortawesome/pro-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class FontAwesomeIconRegistryService
{
  private isInitialized = false;

  readonly iconNameToSoureMappings: { [iconName: string]: string; } =
    {
      ['icon-owl-compare']: '/assets/images/roc-owl-compare.svg'
    };
  constructor
    (
      private library: FaIconLibrary,
      private faConfig: FaConfig,
      private matIconRegistry: MatIconRegistry,
      private domSanitizer: DomSanitizer
    ) { }

  init(): void
  {
    if (this.isInitialized)
    {
      return;
    }

    // config
    this.faConfig.defaultPrefix = 'fal';

    // light icons
    this.library.addIcons
      (
        faTimes,
        faSync,
        faHeartLight,
        faBookmarkLight,
        faCopy
      );

    // solid icons
    this.library.addIcons
      (
        faArrowRight,
        faBookmark,
        faCheck,
        faClone,
        faCompressArrowsAlt,
        faExpandArrowsAlt,
        faHeart,
        faLockAlt,
        faPencilAlt,
        faPlus,
        faRedoAlt,
        faShareSquare,
        faTimesSolid,
        faTrash
      );

    Object.keys(this.iconNameToSoureMappings).forEach((iconName) =>
    {
      this.matIconRegistry.addSvgIcon(
        iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          this.iconNameToSoureMappings[iconName]
        )
      );
    });

    this.isInitialized = true;
  }
}
