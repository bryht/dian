export default class Word {
  id!: string;
  word!: string;
  translation!: string;
  define!: string;
  type!: string;
  pronunciation!: string;
  sign!: string;
  example!: string;
  important!: boolean;
  html!: string;
  url!: string;
  soundUrl!: string | undefined;
  hasContent!: boolean;
  isInLongmen3000!: boolean;
  isPhrase!: boolean;
  dictionary!: string;
  isShow: boolean = false;
}
