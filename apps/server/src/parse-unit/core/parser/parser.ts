import { catchError, map, of, switchMap } from 'rxjs';
import { iParseUnit } from 'src/types';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { createFetch$ } from '../fetch$';
import {
  GetAdListError,
  GetAdListParamsError,
  NoAdListError,
  NoAdListParamsError,
} from '../utils/errors';
import { iAdList, iGetCategoryId } from './types';

interface iOptions {
  parseUnit?: iParseUnit;
  signal: AbortSignal;
}

export class Parser {
  private adListQueryParams: Record<string, string>;

  constructor(private options: iOptions) {}

  public parse() {
    return of(0).pipe(
      switchMap(() => this.getAdListQueryParams()),
      switchMap(() => this.getAdList()),
      map((data) => data.filter((ad) => !ad?.promotion?.top_ad)),
    );
  }

  // ********************
  // ********************
  // Parse siteUrl
  // ********************
  // ********************
  private get siteUrl() {
    return new URL(this.options.parseUnit.siteUrl);
  }
  private get origin() {
    return this.siteUrl.origin;
  }

  private get pathname() {
    return this.siteUrl.pathname;
  }

  private get search() {
    return this.siteUrl.search;
  }

  // ********************
  // ********************
  // Get ad list query paramas
  // ********************
  // ********************
  private get adListQueryParamsUrl() {
    const pageParams = this.pathname.split('/').filter(Boolean).join(',');
    const query = new URLSearchParams(`${this.search}`);

    if (!query.get('search[order]')) {
      query.append('search[order]', 'created_at:desc');
    }

    return new URL(
      `/api/v1/friendly-links/query-params/${pageParams}/?${query}`,
      this.origin,
    );
  }

  private getAdListQueryParams() {
    if (this.adListQueryParams) return of(this.adListQueryParams);

    return createFetch$<iGetCategoryId>(this.adListQueryParamsUrl, {
      signal: this.options.signal,
    }).pipe(
      catchError((err) => {
        throw new GetAdListParamsError(
          stringifyErrorCode(ERROR_CODES.FAILED_GET_AD_LIST_QUERY_PARAMS_REQ),
          `Failed fetch for ad list query params: ${err?.message}`,
        );
      }),
      map((resData) => {
        if (resData?.data) {
          this.adListQueryParams = resData.data;

          return resData.data;
        }

        throw new NoAdListParamsError(
          stringifyErrorCode(ERROR_CODES.NO_AD_LIST_QUERY_PARAMS),
          'Successfull fetch but with no ad list query params',
        );
      }),
    );
  }

  // ********************
  // ********************
  // Get ad list
  // ********************
  // ********************
  private get adListUrl() {
    const query = new URLSearchParams({
      offset: '0',
      limit: '20',
      ...this.adListQueryParams,
    });

    return new URL(`/api/v1/offers/?${query}`, this.origin);
  }

  private getAdList() {
    return createFetch$<iAdList>(this.adListUrl, {
      signal: this.options.signal,
    }).pipe(
      catchError((err) => {
        throw new GetAdListError(
          stringifyErrorCode(ERROR_CODES.FAILED_GET_AD_LIST_REQ),
          `Failed fetch for ad list: ${err?.message}`,
        );
      }),
      map((resData) => {
        if (resData?.data) {
          return resData.data;
        }

        throw new NoAdListError(
          stringifyErrorCode(ERROR_CODES.NO_AD_LIST),
          'Successfull fetch but with no ad list',
        );
      }),
    );
  }
}
