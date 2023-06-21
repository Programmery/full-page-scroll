type ModsType = Record<string, boolean | string | number | undefined | null>;
type MixFunc = (...classNames: Array<string | null | undefined>) => string;
type OtherClasses = Array<string | undefined>;
interface CreateBlock {
  bl: ((mods?: ModsType, otherClasses?: OtherClasses) => string) & {
    mix: MixFunc;
  };
  el: ((
    elemName: string,
    mods?: ModsType,
    otherClasses?: OtherClasses,
  ) => string) & {mix: MixFunc};
  mix: MixFunc;
}

export const convertCamelToKebabCase = (str: string): string =>
  str
    .replace(
      /([a-z])([A-Z])/g,
      (_, lower, upper) => `${lower?.toLowerCase()}-${upper?.toLowerCase()}`,
    )
    .replace(/([A-Z])([a-z])/g, '-$1$2')
    .replace(/^-/, '')
    .toLowerCase();

const getModsClasses = (
  mainClass: string,
  mods: ModsType | undefined,
): string[] =>
  mods
    ? Object.keys(mods).reduce<string[]>((modsAcc, mod) => {
        const value = mods[mod];
        if (!value) {
          return modsAcc;
        }
        const kebabCaseMod = convertCamelToKebabCase(mod);
        if (value === true) {
          modsAcc.push(`_${kebabCaseMod}`);
          return modsAcc;
        }
        modsAcc.push(`_${kebabCaseMod}_${value}`);
        return modsAcc;
      }, [])
    : [];

const getBlockClass = (
  blockName: string,
  mods: ModsType | undefined,
  otherClasses: OtherClasses = [],
): string => {
  const modClasses = getModsClasses(blockName, mods);
  const result: string[] = [blockName, ...modClasses];
  otherClasses.forEach(cl => cl && result.push(cl));
  return result.join(' ');
};
const getElemClass = (
  blockName: string,
  elemName: string,
  mods: ModsType | undefined,
  otherClasses: OtherClasses = [],
): string => {
  const elemClass = `${blockName}__${elemName}`;
  const modClasses = getModsClasses(elemClass, mods);
  const result: string[] = [elemClass, ...modClasses];
  otherClasses.forEach(cl => cl && result.push(cl));
  return result.join(' ');
};

const mix: MixFunc = (...classNames) => classNames.filter(Boolean).join(' ');
export const createBlock = (blockName: string): CreateBlock => {
  const bl: CreateBlock['bl'] = (mods, otherClasses) =>
    getBlockClass(blockName, mods, otherClasses);
  bl.mix = mix;
  const el: CreateBlock['el'] = (elemName, mods, otherClasses) =>
    getElemClass(blockName, elemName, mods, otherClasses);
  el.mix = mix;
  return {bl, el, mix};
};
