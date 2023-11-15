
export function capitalize(string) {return string[0].toUpperCase()+string.slice(1)};

export function title(string) {return string.split(' ').map(capitalize).join(' ')};
