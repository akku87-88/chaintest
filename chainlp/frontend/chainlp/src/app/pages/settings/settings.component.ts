import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Theme } from '../../model/theme.model';
import { ThemeService } from '../../services/theme.service';
import { SecretsService } from '../../services/secrets.service';
import { Secret } from '../../model/secret.model';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {

  private readonly _secrets$: Subject<any> = new Subject<any>();
  private readonly _cache$: Subject<any> = new Subject<any>();
  private readonly _caches$: Subject<any> = new Subject<any>();

  error: any;
  active: number = 1;
  version: string = '0.0.9';
  isCacheCleared: boolean = false;
  areCachesCleared: boolean = false;

  /* theme */
  themes: Theme[] = [
    { val: '', name: 'Select theme' },
    { val: 'dark', name: 'Dark' },
    { val: 'light', name: 'Light' }
  ]
  activeTheme = localStorage.getItem('theme') || '';

  /* aws credentials */
  awsSecrets: any = {
    'aws.accessKeyId': '',
    'aws.secretAccessKey': '',
    'aws.region': ''
  };

  /* azure credentials */
  azureSecrets: any = {
    AZURE_CLIENT_ID: '',
    AZURE_CLIENT_SECRET: '',
    AZURE_TENANT_ID: ''
  };

  /* azure connection string */
  azureConnectionString: any = {
    AZURE_ACCESS_CONNECTION_STRING: ''
  };

  constructor(private themeService: ThemeService, 
    private secretsService: SecretsService,
    private cacheService: CacheService,
    private errorService: ErrorHandlerService) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._secrets$.next(null);
    this._secrets$.complete();
  }

  changeTheme($event: any) {
    const theme = $event.target.value;
    this.themeService.setTheme(theme);
  }

  clearCache(name: string) {
    this.cacheService.clear(name)
    .pipe(takeUntil(this._cache$))
    .subscribe({
      next: (response: any) => {
        this.isCacheCleared = true;
        setTimeout(() => {
          this.isCacheCleared = false;
        }, 2000);
      },
      error: (err) => {
        this.error = this.errorService.getError(err);
      }
    });
  }

  clearAllCaches() {
    this.cacheService.clearAll()
    .pipe(takeUntil(this._caches$))
    .subscribe({
      next: (response: any) => {
        this.areCachesCleared = true;
        setTimeout(() => {
          this.areCachesCleared = false;
        }, 2000);
      },
      error: (err) => {
        this.error = this.errorService.getError(err);
      }
    });
  }

  saveSecrets(obj: any) {
    if (typeof obj === 'object') {
      for (const key in obj) {
        const secret: Secret = new Secret(key, obj[key]);
        this.secretsService.save(secret)
        .pipe(takeUntil(this._secrets$))
        .subscribe({
          next: (response: any) => {
            
          },
          error: (err) => {
            this.error = this.errorService.getError(err);
          }
        });
      }
    } else {
      // todo: error handling
    }
  }

}
