/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

interface Console {
	memory: any;
	assert(condition?: boolean, ...data: any[]): void;
	clear(): void;
	count(label?: string): void;
	countReset(label?: string): void;
	debug(...data: any[]): void;
	dir(item?: any, options?: any): void;
	dirxml(...data: any[]): void;
	error(...data: any[]): void;
	exception(message?: string, ...optionalParams: any[]): void;
	group(...data: any[]): void;
	groupCollapsed(...data: any[]): void;
	groupEnd(): void;
	info(...data: any[]): void;
	log(...data: any[]): void;
	table(tabularData?: any, properties?: string[]): void;
	time(label?: string): void;
	timeEnd(label?: string): void;
	timeLog(label?: string, ...data: any[]): void;
	timeStamp(label?: string): void;
	trace(...data: any[]): void;
	warn(...data: any[]): void;
}

declare var console: Console;
