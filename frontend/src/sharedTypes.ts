type TYear = `${number}${number}${number}${number}`;
type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;
type TDateISODate = `${TYear}-${TMonth}-${TDay}`;

type Metric = {
    id: string
    title: string
    dateAdded: TDateISODate | null
}

export {
    Metric,
    TDateISODate
}
