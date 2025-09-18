export const LOGIN_ERROR_CODE = {
  NAME_INVALID: {
    errorCode: "01",
    message: "이름을 최소 1자 이상 입력해주세요",
  },
  BIRTH_INVALID: {
    errorCode: "02",
    message: "생년월일을 6자리 숫자로 입력해주세요",
  },
  API_ERROR: { errorCode: "03", message: "API 오류가 발생했습니다." },
  USER_NOT_FOUND: { errorCode: "04", message: "사용자를 찾을 수 없습니다." },
};
