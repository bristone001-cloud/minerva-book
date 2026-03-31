/** public 폴더 정적 파일용 (예: /images/foo.png). 배포 시 base(/minerva-book/)가 붙습니다. */
export function publicAssetUrl(path: string): string {
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${trimmed}`;
}
