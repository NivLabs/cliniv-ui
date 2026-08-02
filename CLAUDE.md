# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

CliNiv-UI is the Angular 14 frontend for a hospital/clinic EMR (electronic medical record) system. It is a multi-tenant client for [CliNiv-API](https://github.com/niv-labs/cliniv-api) (Spring Boot/Java), a sibling repo typically checked out alongside this one — when a task needs backend context (endpoint shape, DTO fields, available operations), read it directly from `cliniv-api/src/main/java/br/com/nivlabs/cliniv/` rather than guessing.

**Required Node version: 18.19.1** (see `package.json` `engines`). On a machine where the default `node` is a different major version, `ng build`/`ng serve` can fail with an unrelated-looking `dart-sass` crash (`Cannot read properties of undefined (reading 'indexOf')`). Switch first, e.g. via `nvm use 18` (or install 18.19.1), before running any Angular CLI command.

## Commands

```bash
npm install                # install deps
ng serve                   # dev server on :4200 (use -o to open browser, --port to override)
ng build                   # production-config build → dist/
ng build --configuration development  # dev build, faster/unminified, useful for iterating
ng test                    # Karma/Jasmine unit tests (Chrome, not headless by default — see karma.conf.js)
ng lint                    # TSLint (legacy `@angular-devkit/build-angular:tslint` builder)
ng e2e                     # Protractor e2e tests
npm run config -- --environment=prod   # regenerate src/environments/environment.prod.ts from env vars (BASE_URL, CUSTOMER_ID, CUSTOMER_NAME) via scripts/setenv.ts + dotenv
npm start                  # node server.js — serves an already-built dist/ via Express (production self-host, not a dev server)
```

To run a single spec file with Karma, there's no built-in CLI filter flag in this Angular version — narrow with Jasmine's `fdescribe`/`fit` in the spec, or pass `--include` to the underlying builder (`ng test --include=src/app/path/to/thing.spec.ts`).

The `postinstall` script runs `ngcc` — if dependency resolution looks stale after switching Node versions or branches, rerun `npm install` rather than just `ngcc` manually.

## Architecture

**NgModule-based (not standalone components).** This predates Angular's standalone-component APIs; every new component must be declared in an `NgModule`, generally following the pattern already used nearby rather than introducing standalone components.

**Module layout:**
- `AppModule` (`src/app/app.module.ts`) — root; imports `SecurityModule`, `CoreModule`, `ComponentsModule`, `AdminLayoutModule`.
- `SecurityModule` (`src/app/security/`) — auth: login, signup, forgot-password, JWT handling (`AuthService`, `AuthGuard`, `AuthInterceptor`, `AppHttp`), public unauthenticated routes (`/login`, `/public-schedule`, `/patient-register`).
- `AdminLayoutModule` (`src/app/layouts/admin-layout/admin-layout.module.ts`) — the big one. Nearly every business-domain component, service, and route across the entire app is declared here. It's also imported directly into `AppModule`'s `imports` (in addition to being referenced via `loadChildren` in `app.routing.ts`), so in practice it's part of the eager/main bundle, not a separate lazy chunk — don't assume module-boundary isolation (e.g. separate DI child injector) between it and `AppModule`/`SecurityModule`. When adding a new domain feature, this is where you register the component/service/route, following the existing entries.
- `CoreModule` (`src/app/core/`) — cross-cutting singleton providers: `ErrorHandlerService`, `NotificationsComponent`, `AddressService`, `UtilService`. These are available app-wide via DI without re-importing the module (declared once as providers in `AppModule`'s import graph).
- `ComponentsModule` (`src/app/components/`) — shell chrome (`NavbarComponent`, `SidebarComponent`, `FooterComponent`) plus shared presentational pieces referenced from `AdminLayoutModule`: `LoadingComponent` (`<app-loading [show]="loading">`), `DialogFormActionsComponent` (`<app-dialog-form-actions>` — standard New/Fechar/Salvar footer used across edit dialogs, with an `extraActions` content-projection slot for one-off buttons).

**Per-domain structure.** Business domains (patient, attendance, procedure, appointment, sector, speciality, health-operator, payment-method, user, professional, document-template, dynamic-form, report, settings, ...) each live in their own `src/app/<domain>/` folder, generally:
```
<domain>/
  <domain>.component.ts/html/css       — list/search screen
  <domain>.service.ts                  — HttpClient calls to the backend
  <domain>-edit/<domain>-edit.component.ts/html  — create/update dialog (MatDialog)
```
List screens follow: filter form card → `<app-data-table>` responsive table. Edit dialogs follow: `mat-tab-group` card → form fields → `<app-dialog-form-actions>`. New domains should reuse these two shared components rather than hand-rolling table/footer markup — see `src/app/speciality/` (simplest reference) or `src/app/patient/`/`src/app/attendance/` (masked/formatted columns, row-status coloring) as reference implementations.

**`app-data-table`** (`src/app/components/data-table/data-table.component.ts`) — the shared list-screen table, replacing the old card-grid `app-search-result-list` (removed; if you see it mentioned in old branches/PRs, it no longer exists). Wraps Angular Material `mat-table` + `mat-paginator` with real server-side pagination (`[length]`/`[pageIndex]`/`[pageSize]` + `(page)` emitting a `PageEvent`) instead of the old broken infinite-scroll. Columns are data-driven via `[columns]="columns"` (a `DataTableColumn[]` field on the component: `key`, `label`, optional `cell(row)` formatter, optional `cellClass(row)`/`cssClass` for styling, optional fixed `width`) — column width **must** stay a fixed value shared between header and data cells (bound once via the component's `columnFlex()`), never per-cell auto-sizing, or columns drift out of alignment row to row since content length differs per row. An optional trailing actions column takes `[actions]="actions"` (`DataTableAction[]`: `icon`, `tooltip`, `onClick(row)`), and an optional `[rowClass]="fn"` callback colors the row's left border (`row-active`/`row-medium`/`row-danger`, defined in `data-table.component.css`) for status indicators (see `patient`/`attendance`/`procedure`). Any cell value that's `null`/`undefined`/empty-or-whitespace string is automatically rendered as `-` (handled centrally in `cellValue()` — don't re-implement per-column blank-fallback logic). Wide tables (many columns) scroll horizontally inside their own `.table-responsive` wrapper rather than squeezing columns illegibly — the `<mat-paginator>` deliberately sits **outside** that scroll wrapper so it stays a normal full-width footer instead of being dragged along by the table's horizontal scroll. Formatting helpers (`formatCpf`, `formatPhone`, `formatDate`, `formatDateTime`, `formatCurrency`) live in `src/app/model/format.util.ts` — use these in `cell()` functions instead of template pipes (`| mask`, `| date`, `| currency`), which don't apply to plain string cell values.

**Guided tours (`ngx-ui-tour-md-menu`, currently on `src/app/dashboard/` and `src/app/patient/`):** `TourMatMenuModule.forRoot()` is imported once in `AppModule` (root singleton `TourService`, aliased as `TourService` from `ngx-ui-tour-md-menu`'s `NgxmTourService`), and `<tour-step-template></tour-step-template>` is rendered once in `app.component.html` — don't duplicate either per-page. There is no manual "replay tour" trigger by design (removed on request) — the tour only auto-starts once per screen, gated by a `localStorage` flag (`__<screen>_tour_seen`), checked in `ngAfterViewInit()`. The active-anchor highlight (`.touranchor--is-active`) is styled globally in `src/assets/css/styles.css`, shared by every tour-enabled screen — don't redeclare it per-component.

`TourMatMenuModule` (**without** `.forRoot()` — that would re-register the providers) is also imported into `AdminLayoutModule`. This second import is required: Angular directive matching is scoped per-NgModule ("compilation scope"), separate from DI. Since almost every business component (including `DashboardComponent`) is declared in `AdminLayoutModule`, not `AppModule`, the `[tourAnchor]` directive is only recognized in those templates because `AdminLayoutModule` itself imports the module that exports it — `AppModule` importing it is not enough. Forgetting this makes `tourAnchor="..."` a silent no-op inert HTML attribute (no compile error, since it's a plain attribute, not a bound `[tourAnchor]`): the anchor never registers, and with `isAsync: true` on the step (see below) the tour just hangs forever with no console output at all — this exact bug shipped once before being caught.

To add a tour to a new page: tag target elements with a static `tourAnchor="someId"` attribute, inject `TourService` in the component, define an `IStepOption[]` (each step's `anchorId` must match a `tourAnchor` value on that page, and should set `isAsync: true` — anchor registration timing isn't guaranteed even from `ngAfterViewInit()`, and `isAsync` makes the service wait for the anchor's registration event instead of giving up with "Can't attach to unregistered anchor"), call `tourService.initialize(steps)` in `ngAfterViewInit()`, and `tourService.start()`. Unsubscribe any `tourService.end$`/`start$` subscriptions in `ngOnDestroy()` — `TourService` is a root singleton, so subscriptions survive component destruction otherwise and accumulate across repeated navigation to the page. The active anchor gets a `.touranchor--is-active` class (styled per-component, see `dashboard.component.css`).

**Multi-tenancy / white-labeling:** the app is deployed per-customer via env vars baked into `src/environments/environment*.ts` at build time (`apiUrl`, `customerId`, `customerName` — see `scripts/setenv.ts`). `AuthService` also sends the tenant as an `X-Customer-Id` header (stored in `localStorage`), matching the backend's schema-per-tenant model.

**HTTP/auth:** `AppHttp` (extends `HttpClient` usage patterns) + `AuthInterceptor` attach the JWT (`Authorization: Bearer ...`) and tenant header to outgoing requests; `AuthGuard` protects `AdminLayoutModule` routes (`canLoad`). `ErrorHandlerService.handle(error, dialogRefToClose)` is the standard way service-layer HTTP errors are surfaced to the user (snackbar via `NotificationsComponent`, with special-cased handling for 401/403/expired-token that also closes the passed dialog ref and redirects to `/login`).
