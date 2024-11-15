# Admin Config Package

The **admin-config** package is part of our monorepo, responsible for managing the configuration of the admin dashboards. This package defines the structure and behavior of various models in the admin panel, allowing for customization of how data is displayed, filtered, and interacted with.

## Table of Contents

1. [Overview](#overview)
2. [Dashboard Configuration](#dashboard-configuration)
3. [Dashboard Structure](#dashboard-structure)
4. [Creating a Dashboard](#creating-a-dashboard)
5. [Advanced Configuration](#advanced-configuration)

---

## Overview

The **admin-config** package defines **dashboards** for each model in the system. A dashboard controls how a specific model is represented in the admin panel, such as:

- Which fields are displayed in the list view.
- What fields can be filtered.
- How to handle CRUD operations (create, read, update, delete).
- Custom business logic related to each model.

The dashboards allow for a centralized configuration to ensure that each model behaves consistently across the admin panel.

---

## Dashboard Configuration

Each model in the admin panel has a corresponding **dashboard** configuration that defines:

- **Attributes**: Fields that the model contains.
- **CRUD Options**: What fields are editable, creatable, or deletable.
- **Display Options**: How the model should be presented in list views, detail views, and forms.
- **Filters**: Which fields can be filtered by in the admin panel.

---

## Dashboard Structure

Here’s a breakdown of the properties you’ll find in a typical dashboard configuration:

- **`name`**: The name of the dashboard, typically the model name.
- **`modelName`**: The database model or entity name associated with the dashboard.
- **`attributeTypes`**: An array defining the model's attributes and their types (e.g., strings, integers, relationships).
- **`collectionAttributes`**: Fields to be shown in the collection (list) view.
- **`collectionFilterAttributes`**: Fields that can be filtered in the collection view.
- **`showAttributes`**: Fields to be shown on the record detail page.
- **`createFormAttributes`**: Fields to be shown when creating a new record.
- **`editFormAttributes`**: Fields to be shown when editing a record.
- **`searchAttributes`**: Fields that support text-based searching.

---

## Creating a Dashboard

Here is an example of a basic **dashboard configuration** for a `Product` model:

```ts
// product.dashboard.ts

import { Dashboard } from './dashboard.types';
import { Product } from '@repo/types';
import { FieldType } from '@repo/types';

export const ProductDashboard: Dashboard<Product> = {
  name: 'Product',
  modelName: 'Product',

  // Define which fields are in the database model
  attributeTypes: [
    { name: 'name', type: FieldType.STRING },
    { name: 'price', type: FieldType.INTEGER },
    { name: 'stock', type: FieldType.INTEGER },
  ],

  // Define which fields are shown in the collection (list) view
  collectionAttributes: ['name', 'price', 'stock'],

  // Define which fields can be filtered
  collectionFilterAttributes: ['name', 'price'],

  // Define which fields are shown in the detailed view of a record
  showAttributes: ['name', 'price', 'stock'],

  // Define which fields are shown when creating a record
  createFormAttributes: ['name', 'price', 'stock'],

  // Define which fields are shown when editing a record
  editFormAttributes: ['name', 'price', 'stock'],

  // Define searchable fields
  searchAttributes: ['name'],

  // Define how a record's display name is shown
  getDisplayName: (record: Product): string => record.name,

  // Define if a record is deletable
  isDeletable: () => true,

  // Define if a record is editable
  isEditable: () => true,

  // Define if a record is creatable
  isCreatable: () => true,

  // Hook to process data before creating a record
  beforeCreate: (data: object) => data,
};
```

## Advanced Configuration

While the basic dashboard setup covers most use cases, advanced configurations allow you to extend functionality for certain models:

- **Custom Filters**: You can define specific attributes for filtering based on business logic.
- **Related Attributes**: Define relationships between models and how they should be displayed.
- **Searchable Fields**: Customize which fields are searchable in the admin panel.
- **Hooks**: Add hooks like `beforeCreate` or `beforeDelete` to run custom logic before actions are taken on records.
