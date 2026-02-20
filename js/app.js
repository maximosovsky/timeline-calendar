import * as helpers from './helpers.js';

dayjs.extend(window.dayjs_plugin_localeData);
dayjs.extend(window.dayjs_plugin_isoWeek);

let localeCode = (appState.l) ? appState.l : 'ru'; // dayjs.locale(localeCode); // use locale globally
let duration   = (appState.d) ? appState.d : 3;
	if (duration < 1) {
		duration = 1; qs.set('d', duration);
	}
	if (duration > 60) {
		duration = 60; qs.set('d', duration);
	}
let emplines   = (appState.g) ? appState.g : 5;
	if (emplines < 5) {
		emplines = 5; qs.set('g', emplines);
	}
	if (emplines > 20) {
		emplines = 20; qs.set('g', emplines);
	}
let day = dayjs(new Date());
// let day = dayjs(new Date('2021-11-1'));

const glosets = { // Global settings, in points
	locale: localeCode,
	defaultLocale: 'ru',
	start: (day.isValid()) ? day.set('date', 1) : dayjs().set('date', 1), // Start year-month
	months: duration, // Total months, including current one
	noteLines: emplines,
	noteLinesHeights: 14,
	noteLinesExtra: true,
	widths: {
		pageMargins: 18, // Page margins, number or [left,top,right,bottom]
		pageWidth:    0, // Total page width, calculated
		colMainWide:  0, // Main wide column (31 d) width, calculated
		colMainNarr:  0, // Main narrow column (29 d) width, calculated
		colHorCal:    6, // Horisontal calendar column width
		colHorCalPad: 1.5,  // Horisontal calendar column padding
		linesThick:   1.5,  // Vertical thick lines
		linesThin:    0.25, // Vertical thin lines
		cols:        [], // Page columns widths, calculated
	},
	ru: {
		holidays: {
			'0223': 'День защитника Отечества',
			'0308': 'Международный женский день',
			'0501': 'Праздник весны и труда',
			'0509': 'День Победы',
			'0612': 'День России',
			'1104': 'День народного единства',
		},
		footerCopy: [{text: '© Максим Осовский, '+ (dayjs().format('YYYY')) +'. ', color: 'grey'}, {text: 'Сделано Wayfinding.pro', link: 'http://wayfinding.pro/', color: 'grey'},],
	},
	en: {
		footerCopy: [{text: '© '+ (dayjs().format('YYYY')) +' Maxim Osovsky. ', color: 'grey'}, {text: 'Made by Wayfinding.pro', link: 'http://wayfinding.pro/', color: 'grey'},],
	}
};
glosets.widths.colMainWide =  // !!! Refactoring => helpers
	31 * (glosets.widths.colHorCal + glosets.widths.colHorCalPad*2) + 
	(31-1) * glosets.widths.linesThin;
glosets.widths.colMainNarr =  // !!! Refactoring => helpers
	29 * (glosets.widths.colHorCal + glosets.widths.colHorCalPad*2) + 
	(29-1) * glosets.widths.linesThin;

let calObj = helpers.getCalObject(glosets);
glosets.widths.pageWidth = calObj.width + glosets.widths.pageMargins*2; 
glosets.widths.cols = calObj.cols;
delete calObj.width;
delete calObj.cols;

// Declaring custom fonts
pdfMake.fonts = {
	plex: {
		normal: 'IBMPlexSans-Regular.ttf',
		bold:   'IBMPlexSans-SemiBold.ttf',
	}
};
// Declaring your layout
let tableLayouts = {
	mainLayout: {
		vLineWidth: function (i) { return glosets.widths.linesThick; },
		hLineWidth: function (i,node) { return 0; },
		paddingLeft: function (i,node) { return 0; },
		paddingRight: function (i) { return 0; },
	},
	vertMonthCal: {
		vLineWidth: function (i, node) {
			return (i == 0 || i == node.table.widths.length) ? 0 : glosets.widths.linesThin;
		},
		hLineWidth: function (i) {
			return (i == 0) ? 0 : glosets.widths.linesThin;
		},
		hLineStyle: function (i, node) {
			return {dash: {length: 1, space: 1}};
		},
		paddingLeft: function (i) { return glosets.widths.colHorCalPad; },
		paddingRight: function (i) { return glosets.widths.colHorCalPad; },
		paddingTop: function (i) { return 0; },
		paddingBottom: function (i) { return 0; },
	},
	horMonthCal: {
		vLineWidth: function (i, node) {
			return (i == 0 || i == node.table.widths.length) ? 0 : glosets.widths.linesThin;
		},
		vLineStyle: function (i) {
			return {dash: {length: 1, space: 1}};
		},
		hLineWidth: function (i) {
			return (i == 0) ? 0 : glosets.widths.linesThin;
		},
		paddingLeft: function (i) { return glosets.widths.colHorCalPad; },
		paddingRight: function (i) { return glosets.widths.colHorCalPad; },
		paddingTop: function (i) { return 0; },
		paddingBottom: function (i) { return 0; },
	},
	horNoteLines: {
		vLineWidth: function (i, node) { return 0; },
		hLineWidth: function (i) {
			return (i == 0) ? 0 : glosets.widths.linesThin;
		},
		paddingLeft: function (i) { return glosets.widths.colHorCalPad; },
		paddingRight: function (i) { return glosets.widths.colHorCalPad; },
		paddingTop: function (i) { return 0; },
		paddingBottom: function (i) { return 0; },
	},
	boxMonthCal: {
		vLineWidth: function (i) { return 0; },
		hLineWidth: function (i) {
			return (i == 1) ? glosets.widths.linesThin : 0;
		},
		paddingLeft: function (i) { return glosets.widths.colHorCalPad; },
		paddingRight: function (i) { return glosets.widths.colHorCalPad; },
		paddingTop: function (i) { return 0; },
		paddingBottom: function (i) { return 0; },
	},
};

let dd = {
	// pageSize: a string or { width: number, height: number }
	pageSize: { 
		width: glosets.widths.pageWidth,
		height: 'auto'
	},
	pageMargins: glosets.widths.pageMargins,
	info: {
		title: 'Planner 2',
		author: 'Maxim Osovsky',
		// subject: 'subject of document',
		// keywords: 'keywords for document',
	},
	content: [
		{
			layout: 'mainLayout',
			table: {
				widths: glosets.widths.cols,
				body: [
					calObj.rowYears,
					calObj.rowMonthNames,
					calObj.rowVertCal,
					calObj.rowHorCal,
					calObj.rowNotelines,
					calObj.rowBoxCal,
					calObj.rowCopy,
				]
			}
		},
	],
	defaultStyle: { font: 'plex' },
	styles: {
		vertCalMargins: { margin: [11, 0, 0, 7] },
		regCellMargins: { margin: [11, 0, 0, -3.25] },
		noCellMargins:  { margin: [ 0, 0, 0, 0] },
		h1: { // year
			fontSize: 48,
			characterSpacing: -4,
			//lineHeight: 0.75,
			margin: [9, -18, 5, 0],
		},
		h2: { // month
			fontSize: 36,
			bold: true,
			characterSpacing: -1,
			margin: [10.5, -13, 5, -2],
		},
		h3: { // month secondary
			fontSize: 21,
			margin: [10, 5, 5, 3],
		},
		vertDay: {
			fontSize: 16,
		},
		vertDayColumn: {
			margin: [-3, 3.5, 2.5, 0.5],
		},
		boxDay: {
			fontSize: 11,
			margin: [-1, 5, -1.5, -3],
		},
		weekOfYear: {
			fontSize: 8,
			alignment: 'right',
			margin: [-1, 8, -1.5, 0],
		},
		weekDay: {
			fontSize: 8,
			margin: [-1, 1.5, 0, 0],
		},
		small: { fontSize: 8 },
		tiny:  { fontSize: 5.5, characterSpacing: -0.2 },
		tinySpaced: { characterSpacing: 0.2 },
		center: { alignment: 'center' },
		red: { color: 'red' },
		footerCopy: {
			fontSize: 6.5,
			characterSpacing: 0.1,
			alignment: 'right',
			margin: [0, 1.5, -(glosets.widths.linesThick*1.5), 0],
		},
	}
};

// const pdf = pdfMake.createPdf(dd, tableLayouts);
// pdf.getDataUrl(function(outDoc) {
// 	document.getElementById('pdfV').src = outDoc;
// });

// let downloadPDF = function() {
// 	pdfMake.createPdf(dd,tableLayouts).download('cal2.pdf');
// };

pdfMake.createPdf(dd, tableLayouts)
	   .getDataUrl(function(outDoc) {
			// document.getElementById('pdfV').src = outDoc;
			b64 = outDoc;
			PDFObject.embed(b64, "#pdfV", {
				pdfOpenParams: { view: "FitW" },
				fallbackLink: "<div style='margin:1rem'>К сожалению, ваш браузер не поддерживает просмотр PDF. Попробуйте воспользоваться другим браузером или устройством.</div>",
			});
});

// pdfMake.createPdf(dd).download('sample.pdf');