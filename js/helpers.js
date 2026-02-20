
// Function calculates page width,
// column widths, and returns the object
// to be rendered as the calendar
export function getCalObject(opts){
	const zeroPad = (num, places) => String(num).padStart(places, '0');
	const interval = 'month';
	const lcl  = (opts[opts.locale]) ? opts.locale : opts.defaultLocale;
		  dayjs.locale(lcl); // update/use locale globally
	const nle  = opts.noteLinesExtra;
	const wide = opts.widths.colMainWide; // !!! Refactoring
	const narr = opts.widths.colMainNarr; // !!! Refactoring
	const empFirstCell = { border: [false,false,false,false], text: '' };
	// const empFirstCellBorderTop = { border: [false,true,true,false], text: ' ' };
	const start = opts.start;//dayjs().set('date', 1);
	const end = start.add(opts.months, 'month').set('date', 0); // dayjs()
	const res = { 
		width: nle ? narr : 0,
		cols: [],
		rowYears:      nle ? [empFirstCell] : [],
		rowMonthNames: nle ? [empFirstCell] : [],
		rowVertCal:    nle ? [empFirstCell] : [],
		rowHorCal:     nle ? [empFirstCell] : [],
		rowNotelines:  nle ? [{
				border: [false,false,false,false],
				// text: '',
				layout: 'horNoteLines',
				style: 'small',
				table: {
					widths: '*',
					heights: opts.noteLinesHeights,
					body: Array.from({length:opts.noteLines},(_,i)=> ['']) //_.times(4, _.times(1, _.stubString))
				},
			}] : [],
		rowBoxCal: nle ? [empFirstCell] : [],
		rowCopy:   nle ? [empFirstCell] : [],
		years: {}, // temporary, deleted on return
		calendars: [{}]
		// [{
		// 	body: Array.from(Array(7), () => new Array(8))//Array.from( {length:7},(_,a)=> Array.from({length:8},(_,b)=> a +'('+ b +')') ) // 
		// }], // temporary, deleted on return
	};
	// const calsTemplate = Array.from( {length:7},(_,a)=> Array.from({length:8},(_,b)=> a +'('+ b +')') );//Array.from(Array(7), () => new Array(8));
	let arr = [{}];
	let cl = 1;

	res.width += opts.widths.linesThick*(opts.months + 1);
	if (nle) res.cols.unshift(narr);

	Array.from(Array(end.diff(start, interval) + 1).keys()).map((i) => {
		const y  = start.add(i, interval).year();
		const m  = start.add(i, interval).month();
		const ml = start.add(i, interval).daysInMonth(); //daysInMonth(y, m);
		const w  = (m == 1) ? narr : wide;
		let cd, wi, we;

		arr.push(
			_.clone({
				body: Array.from( {length:7},(_,a)=> Array.from({length:8},(_,b)=> ' ') ) // a +'('+ b +')'
			})
		);

		res.width += w;
		res.cols.push(w);

		if (i == 0) {
			res.rowCopy.push({
				text: opts[lcl].footerCopy, style: ['footerCopy','tiny','tinySpaced'], colSpan: opts.months,
				border: [false,false,false,false],
			});
		} else {
			res.rowCopy.push({text:' '});
		}

		if (i != 0 && start.add(i-1, interval).year() === y) { // Not first month in year
			res.rowYears.push({});
			if (res.years[y] !== undefined) res.rowYears[ (nle ? res.years[y]['id']+1: res.years[y]['id']) ]['colSpan'] += 1;
		} else { // First month in year (even incomplete)
			Object.assign(res.years, { [y]: { ['id']: i } });
			res.rowYears.push({ text: y, style: 'h1', colSpan: 1 });
		}
		res.rowMonthNames.push({ text: _.startCase(dayjs().month(m).format('MMMM')), style: 'h2' });
		res.rowVertCal.push({
			style: 'vertCalMargins',
			layout: 'vertMonthCal',
			table: {
				widths: '*',
				// heights: 28,
				// !!! Needs refactoring
				body: [] //[[i],[i]]//Array.from({length:31},(_,i)=> [''])
			}
		});
		res.rowHorCal.push({ style: ['tiny','center'], columnGap: opts.widths.linesThin, columns: [] });
		res.rowNotelines.push({
			layout: 'horMonthCal', style: 'small',
			table: {
				widths: '*', 
				heights: opts.noteLinesHeights,
				// !!! Needs refactoring
				body: Array.from( {length:opts.noteLines},(_,i)=> Array.from({length:ml},(_,i)=> ['']) )
			}
		});
		res.rowBoxCal.push([
			{
				text: _.startCase(dayjs().month(m).format('MMMM')),
				style: 'h3',
			},
			{
				style: 'regCellMargins',
				layout: 'boxMonthCal',
				table: {
					widths: [21,21,21,21,21,21,21,14],//'*', 
					// heights: 12,
					body: arr[i+1].body
				}
			}
		]);

		for (let n = 0; n < ml; n++) {
			cd = dayjs(y +'-'+ (m+1) +'-'+ (n+1));
			wi = cd.day() == 0 ? 6 : cd.day()-1;
			we = (cd.day() === 6 || cd.day() === 0);

			res.rowHorCal[res.rowHorCal.length-1].columns.push({
				text: cd.format('dd').toUpperCase().charAt(0) +"\n"+ (n+1),
				color: we ? 'red' : '',
			});

			arr[i+1].body[cl][wi] = {
				text: n + 1,
				style: we ? ['red','boxDay'] : 'boxDay',
			};

			res.rowVertCal[ nle? i+1 : i ].table.body.push([]);
			res.rowVertCal[ nle? i+1 : i ].table.body[n].push([{
				columns: [
					{
						style: 'vertDayColumn',
						text: [
							{ text: (n+1) +' ', style: we ? ['red','vertDay'] : 'vertDay', },
							{ text: _.startCase(cd.format('dd')), style: we ? ['small','red'] : 'small', }
						]
					},
					{
						style: 'vertDayColumn',
						alignment: 'right',
						text: [
							{ text: ' ', style: 'vertDay', },
							{ text: (opts[lcl].holidays != undefined && opts[lcl].holidays[zeroPad(m+1, 2) + zeroPad(n+1, 2)] != undefined) ? opts[lcl].holidays[zeroPad(m+1, 2) + zeroPad(n+1, 2)] : '', style: ['tiny','tinySpaced'], }	
						]
					}
				],
			}]);

			if (cd.day() === 0) {
				arr[i+1].body[cl][wi+1] = {
					text: zeroPad(cd.isoWeek(), 2),
					style: 'weekOfYear',
				};
				cl += 1;
			}
			if (n == ml-1) {
				arr[i+1].body[cl][arr[i+1].body[cl].length-1] = {
					text: zeroPad(cd.isoWeek(), 2),
					style: 'weekOfYear',
				};
				if (ml < 31) {
					Array.from({length:31-ml},(_,a)=> res.rowVertCal[ nle? i+1 : i ].table.body.push([{columns:[{ style: ['vertDay','vertDayColumn'],text:' '},{}]}]));
				}
				for (var wdi = 1; wdi < 8; wdi++) {
					arr[i+1].body[0][wdi-1] = {
						text: _.startCase(dayjs.weekdaysMin()[(wdi==7)?0:wdi]),
						style: (wdi>5) ? ['red','weekDay'] : 'weekDay',
					}
				}
				cl = 1;
			}
		}
	});

// console.log(arr);

	delete res.years;
	delete res.calendars;
	return res;
};
