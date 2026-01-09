export interface SeasonInfo {
  title: string;
  subtitle: string;
}

export const getSpringTitle = (): SeasonInfo => ({
  title: '봄 너무 포근한데',
  subtitle: '포근하다 몇도일까?'
});

export const getSummerTitle = (): SeasonInfo => ({
  title: '지금 너무 더운데',
  subtitle: '너무 덥다 몇도일까?'
});

export const getAutumnTitle = (): SeasonInfo => ({
  title: '가을 너무 쾌적한데',
  subtitle: '쾌적하다 몇도일까?'
});

export const getWinterTitle = (): SeasonInfo => ({
  title: '지금 너무 추운데',
  subtitle: '너무 춥다 몇도일까?'
});

export const getSeasonTitle = (): SeasonInfo => {
  const month = new Date().getMonth() + 1;

  if (month >= 3 && month <= 5) return getSpringTitle();
  if (month >= 6 && month <= 8) return getSummerTitle();
  if (month >= 9 && month <= 11) return getAutumnTitle();
  return getWinterTitle();
};
