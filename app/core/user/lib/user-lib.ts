// ... existing code ...
// Retorna el locale y la currency según el parámetro recibido
export function getLocaleAndCurrency(currency: string) {
	// Puedes expandir este switch si necesitas más monedas/idiomas
	switch (currency.toUpperCase()) {
		case "CLP":
			return { locale: "es-CL", currency: "CLP" };
		case "EUR":
			return { locale: "es-ES", currency: "EUR" };
		case "USD":
			return { locale: "es-US", currency: "USD" };
		case "MXN":
			return { locale: "es-MX", currency: "MXN" };
		default:
			return { locale: "es-ES", currency };
	}
}
// ... existing code ...
