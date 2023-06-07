# VueCompose

VueCompose is a library of VueJS3 components that allow a user to manipulate a raw VueJS template using wysiwyg principles.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

VueCompose is a Vue 3.x component that allows a user to manipulate raw Vue template strings using a WYSIWYG view. With VueCompose, you can easily create complex VueJS templates using a simple drag-and-drop interface. VueCompose is built on top of Vue 3.x, so it is easy to integrate into your existing Vue 3.x projects.

## Getting Started

This project is not yet hosted on npmjs.com, so you will need to build and include this package manually. To build the package, you can run the following commands:

```bash
npm run build
npm pack
```

This will create a tarball file in the root of the project. Copy this file into the project in which you wish to use VueCompose. Then, you can install the package using the following command:

```bash
npm i -D vuecompose-0.0.1.tgz
```

## Usage

Once you have installed VueCompose you can include it within your app. Here is an example usage of the component:

```html
<script setup lang="ts">
// Import the main editor component
import { Composer } from 'vuecompose';

// Use your internal SFC components in the editor
import StaffList from './components/StaffList.vue';
import StaffCard from './components/StaffCard.vue';

// Provide the raw Vue template for editing
const template = ref('<staff-list><staff-card>Person 1</staff-card><staff-card>Person 2</staff-card></staff-list>');

// Provide the schema for the available components inside the editor
const schema = {
	'staff-list': {
		component: StaffList,
		flow: 'block',
	},
	'staff-card': {
		component: StaffCard,
		flow: 'block',
	}
};
</script>
<template>
	<Composer v-model="template" :schema="schema" />
</template>
```

## Contributing

If you would like to contribute to VueCompose, you can do so by forking the repository and creating a pull request. Before creating a pull request, please make sure to read the contribution guidelines.

## License
VueCompose is licensed under the MIT License. See the LICENSE file for more information.