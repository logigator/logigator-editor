export type Theme = 'light' | 'dark';

export type EditorColorKey = 'background' | 'wire' | 'grid' | 'selectRect';

export type EditorColors =  {
	[T in Theme]: {
		[K in EditorColorKey]: number;
	};
};