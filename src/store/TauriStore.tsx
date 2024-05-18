import type React from 'react';
import {
	useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import {Store} from 'tauri-plugin-store-api';
import {debug, warn} from 'tauri-plugin-log-api';

const SaveDelay = 2000;

const stores: Record<string, Store> = {};

function getTauriStore(filename: string) {
	if (!(filename in stores)) {
		stores[filename] = new Store(filename);
	}

	return stores[filename];
}

export function useTauriStore<T extends Record<string, unknown>>(key: string, defaultValue: T, storeName = 'data.dat'): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
	// StoreName is a path that is relative to AppData if not absolute
	const [state, setState] = useState<T>(defaultValue);
	const [loading, setLoading] = useState(true);
	const store = getTauriStore(storeName);
	const timeoutRef = useRef<ReturnType<typeof setInterval>>();

	useLayoutEffect(() => {
		let allow = true;
		void store.get<T>(key)
			.then(value => {
				if (value === null) {
					void warn(`property '${key}' is not stored in '${storeName}'`);
				} else {
					void debug(`loaded property '${key}' from ${storeName}: ${JSON.stringify(value)}`);
				}

				if (allow && value !== null) {
					setState(value);
					Object.keys(defaultValue).forEach(defaultKey => {
						if (!(defaultKey in value)) {
							void warn(`key '${defaultKey}' not found in property '${key}' store '${storeName}'`);
							setState(prevState => ({...prevState, [defaultKey]: defaultValue[defaultKey]}));
						}
					});
				}
			}).catch(() => {
				void store.set(key, defaultValue).then(() => {
					timeoutRef.current = setTimeout(async () => store.save(), SaveDelay);
				});
			})
			.then(() => {
				if (allow) {
					setLoading(false);
				}
			});
		return () => {
			allow = false;
		};
	}, []);
	// UseLayoutEffect does not like Promise return values.
	useEffect(() => {
		// Do not allow setState to be called before data has even been loaded!
		// this prevents overwriting
		if (!loading) {
			clearTimeout(timeoutRef.current);
			void store.set(key, state).then(() => {
				timeoutRef.current = setTimeout(() => {
					void store.save().catch(() => {
						void warn(`failed to save store ${storeName}`);
					});
				}, SaveDelay);
			});
		}
		// Ensure data is saved by not clearing the timeout on unmount
	}, [state]);
	return [state, setState, loading];
}
