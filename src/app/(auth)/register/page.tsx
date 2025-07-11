'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import AlertModal from '../../../../components/common/AlertModal';
import BackButton from '../../../../components/common/BackButton';
import clsx from 'clsx';
import TermsModal from '../../../../components/common/TermsModal';
import CountrySelectModal from '../../../../components/common/CountrySelectModal';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');  
  const login = useAuthStore((state) => state.login);
  const [autoLogin, setAutoLogin] = useState(true);

  const [form, setForm] = useState({
    member_id: '',
    auth_code: '',
    member_pwd: '',
    member_pwd_new: '',
    name_1st: '',
    name_3rd: '',
    birth: '',
    gender: '',
    nationality: '',
    city: '',
    national_code: '',
    phone: '',
    MailYN: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    title: '',
    description: '',
    buttonText: t('loginEmail.modal.button', 'OK'),
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [modalContent, setModalContent] = useState<'cancel' | 'terms' | 'privacy' | 'ad'>('cancel');
  const [showTerms, setShowTerms] = useState(false);

  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10분 = 600초
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!showVerification) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showVerification]);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const isPasswordValid = (password: string) => {
    return /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && password.length >= 8;
  };

  const handleChange = (name: string, value: string) => {
    const onlyEnglish = /^[a-zA-Z]*$/;

    if(name === 'name_1st' || name === 'name_3rd') {
      if (onlyEnglish.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckDuplicate = async () => {
    if (!form.member_id) {
      setAlert({
        open: true,
        title: 'Check Email',
        description: 'Please enter an email to check.',
        buttonText: 'OK',
      });
      return;
    }

    if (!form.nationality) {
      setAlert({ open: true, title: 'Caution', description: 'Please select your country/region.', buttonText: 'OK' });
      return;
    }

    try {
      const res = await fetch(`/api/member/check-id?member_id=${encodeURIComponent(form.member_id)}`);
      const data = await res.json();

      if (data.DeleteYN === 'Y') {
        setAlert({ open: true, title: 'Unavailable', description: t('loginEmail.signUp.emailUnavailable', 'This email has been withdrawn and cannot be reused.'), buttonText: 'OK' });
      } else if (data.idx) {
        setAlert({ open: true, title: 'Duplicate', description: t('loginEmail.signUp.emailDuplicate', 'This email is already in use.'), buttonText: 'OK' });
      } else {
        setAlert({ open: true, title: 'Available', description: t('loginEmail.signUp.emailAvailable', 'This email is available.'), buttonText: 'OK' });

        setIsVerified(false);
        setShowVerification(true);
        setTimeLeft(600); // 리셋

        const res = await fetch('/api/auth/send', {
          method: 'POST',
          body: JSON.stringify({ member_id: form.member_id, nationality: form.nationality }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();

      }
    } catch (error) {
      console.log(error);
      setAlert({ open: true, title: 'Error', description: 'Failed to check email. Please try again.', buttonText: 'OK' });
    }
  };

  const handleVerify = async () => {
    if (!form.auth_code) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descVerifyCode', 'Please enter verify code.'), buttonText: 'OK' });
      return;
    }

    const res = await fetch('/api/auth/check', {
      method: 'POST',
      body: JSON.stringify({ member_id: form.member_id, token: form.auth_code }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    const code = data.result;

    const messages: Record<string, string> = {
      '0000': t('loginEmail.signUp.verifySuccess', 'Authentication succeeded.'),
      '0001': t('loginEmail.signUp.verifyFailed', 'Authentication failed.'),
      '0002': t('loginEmail.signUp.verifyTimeOut', 'Timeout. Please try again.'),
    };

    if(code === "0000") {
      setIsVerified(true);
    }

    setAlert({
        open: true,
        title: 'Caution',
        description: messages[code] || 'Unknown response',
        buttonText: 'OK',
    });
  }

  const handleSubmit = async () => {
    if (!form.member_id) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descMemberId', 'Please enter your email.'), buttonText: 'OK' });
      return;
    }

    if (!isVerified) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descVerifyEmail', 'Please verify your email address.'), buttonText: 'OK' });
      return;
    }
  
    if (!form.member_pwd) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descPassword', 'Please enter your password.'), buttonText: 'OK' });
      return;
    }
  
    if (!form.member_pwd_new) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descPasswordAgain', 'Please confirm your password.'), buttonText: 'OK' });
      return;
    }
  
    if (!isPasswordValid(form.member_pwd)) {
      setAlert({ open: true, title: 'Password Error', description: t('loginEmail.signUp.descPasswordError', 'Password must be at least 8 characters and include uppercase, lowercase, and numbers.'), buttonText: 'OK' });
      return;
    }
  
    if (form.member_pwd !== form.member_pwd_new) {
      setAlert({ open: true, title: 'Password Mismatch', description: t('loginEmail.signUp.descPasswordMismatch', 'Password and confirmation do not match.'), buttonText: 'OK' });
      return;
    }
  
    if (!form.name_1st || !form.name_3rd) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descName', 'Please enter your full name.'), buttonText: 'OK' });
      return;
    }
  
    if (!form.birth) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descBirthday', 'Please enter your date of birth.'), buttonText: 'OK' });
      return;
    }
  
    if (!form.gender) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descGender', 'Please select your gender.'), buttonText: 'OK' });
      return;
    }
  
    if (!form.nationality) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descCountryRegion', 'Please select your country/region.'), buttonText: 'OK' });
      return;
    }
  
    if (!form.city) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descCity', 'Please enter your city of residence.'), buttonText: 'OK' });
      return;
    }
  
    if (!form.national_code) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descCountryCode', 'Please select your country code.'), buttonText: 'OK' });
      return;
    }
  
    if (!form.phone) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descContactNumber', 'Please enter your contact number.'), buttonText: 'OK' });
      return;
    }
  
    if (!agreeTerms || !agreePrivacy) {
      setAlert({ open: true, title: 'Caution', description: t('loginEmail.signUp.descTerm', 'You must agree to the Terms of Use and Privacy Policy.'), buttonText: 'OK' });
      return;
    }


    if (form.member_pwd !== form.member_pwd_new) {
      setAlert({
        open: true,
        title: 'Password Mismatch',
        description: t('loginEmail.signUp.descPasswordMismatch', 'Password and confirmation do not match.'),
        buttonText: 'OK',
      });
      return;
    }
    

    try {
      const [year, month, day] = form.birth ? form.birth.split('-') : ['', '', ''];

      const res = await fetch('/api/member/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'INSERT',
          member_id: form.member_id,
          member_pwd: form.member_pwd,
          member_pwd_new: form.member_pwd_new,
          Name_1st: form.name_1st,
          Name_2nd: '',
          Name_3rd: form.name_3rd,
          Birth_year: year,
          Birth_month: month,
          Birth_day: day,
          Gender: form.gender,
          passport: '',
          Nationality: form.nationality,
          City: form.city,
          National_Code: form.national_code,
          zipcode: '',
          address: '',
          Phone: form.phone,
          MailYN: '',
          favorite_artist: '',
          favorite_artist_etc: '',
          site_language: 'EN',
          MailSelector: '',
          U_IP: '',
        }),
      });
    
      const result = await res.json();
      // 이후 결과 처리 로직은 그대로 유지
    
      const code = result.resultCode;

      const messages: Record<string, string> = {
        '0000': 'Your information has been successfully registered.',
        '0001': 'This email is already in use.',
        '0002': 'Password mismatch.',
        '9999': 'Unknown error occurred.',
      };

      setAlert({
        open: true,
        title: 'Registration Result',
        description: messages[code] || 'Unknown response',
        buttonText: 'OK',
      });

      if (code === '0000') {
        setTimeout(() => {
          // window.location.href = '/login';
          handleLogin();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      setAlert({ open: true, title: 'Network Error', description: 'There was a problem connecting to the server.', buttonText: 'OK' });
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ member_id: form.member_id, member_pwd: form.member_pwd }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        setAlert({
          open: true,
          title: t('loginPw.loginFailed', 'Login Failed'),
          description: t('loginPw.incorrectEmailPassword', 'Incorrect email or password.'),
          buttonText: 'OK',
        });
        return;
      }

      const data = await res.json();
      const user = data.user;

      login(
        data.token,
        {
          idx: user.idx,
          member_id: user.email,
          Name_1st: user.Name_1st,
          Name_3rd: user.Name_3rd,
          email: user.email,
          member_pwd: user.member_pwd,
        },
        autoLogin
      );

      router.replace(redirect ?? '/');
    } catch (err) {
      console.error('Login error:', err);
      setAlert({
        open: true,
        title: t('common.error', 'Login Error'),
        description: t('common.error', 'An error occurred during login.'),
        buttonText: 'OK',
      });
    }
  };  

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white py-5 text-black relative">
      <div className='w-full px-5 '>
    <BackButton label={t('loginEmail.signUp.sub', 'Register')} />

    <div className="space-y-4">
      {/* 국가 선택 */}
      <div className="mt-6">
        <h2 className="text-[16px] font-semibold mb-2">
          {t('personalInfo.country', 'Country/Region')}
        </h2>
        <button
          type="button"
          onClick={() => setShowCountryModal(true)}
          className="w-full border rounded-xl px-4 py-3 text-[16px] text-left text-gray-600"
        >
          {form.nationality || t('personalInfo.country', 'Country/Region')}
        </button>
      </div>

      {/* 도시 입력 */}
      <div className="mt-4">
        <input
          placeholder={t('personalInfo.city', 'City of residence')}
          value={form.city}
          onChange={(e) => handleChange('city', e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-[16px]"
        />
        <p className="text-xs text-gray-500 ml-2 mt-1">
          {t('personalInfo.cityNote', 'Do not put full address (ex. Seoul)')}
        </p>
      </div>

      <p className="text-[16px] font-semibold my-4">
        {t('loginEmail.title', 'Please register to use CONCONTOWN services.')}
      </p>

      {/* 이메일 입력 + 중복 확인 */}
      <p className="text-xs text-gray-500 mb-1">
        {t('register.guide.email')}
      </p>
      <div className="flex gap-2">        
        <input
          placeholder={t('loginEmail.emailPlaceholder', 'Email')}
          value={form.member_id}
          onChange={(e) => handleChange('member_id', e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-[16px] bg-white"
        />
        <button
          onClick={handleCheckDuplicate} // ✅ 이렇게 수정해야 함
          className="px-4 py-2 rounded-xl text-[16px] font-medium bg-[#FF8FA9] text-white"
        >
          {t('common.check', 'Check')}
        </button>

      </div>

      {/* 인증번호 입력 영역 */}
      {showVerification && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              value={form.auth_code}
              onChange={(e) => handleChange('auth_code', e.target.value)}
              placeholder={t('loginEmail.signUp.descVerifyCode', 'Please enter verify code.')}
              className="w-full border rounded-xl px-4 py-3 text-[16px] bg-white"
            />
            <button 
              onClick={handleVerify}
              className="px-4 py-2 rounded-xl text-[16px] font-medium bg-[#4CAF50] text-white">
              {isVerified ? t('login.verified', 'Verified') : t('login.verify', 'Verify')}
            </button>
          </div>
          {!isVerified && <p className="text-sm text-gray-600">
            {timeLeft > 0
              ? t('loginEmail.signUp.verifyCodeValid10') + `(${formatTime(timeLeft)})`
              : t('loginEmail.signUp.verifyCodeExpired')}
          </p>}
        </div>
      )}

      {/* 비밀번호 입력 */}
      <p className="text-xs text-gray-500 mb-1">
        {t('register.guide.passwordRule')}
      </p>

      <div className="relative">


        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={t('password.password', 'Password')}
          value={form.member_pwd}
          onChange={(e) => handleChange('member_pwd', e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-[16px]"
        />
        <img
          src={showPassword ? 'eye.svg' : 'eye-slash.svg'}
          alt="toggle visibility"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 w-5 h-5 cursor-pointer"
        />
      </div>
      {/* <p className="text-xs text-gray-500 ">
        {t('password.characters', 'Password must be at least 8 characters with uppercase, lowercase, and numbers.')}
      </p> */}

      {/* 비밀번호 확인 */}
      <p className="text-xs text-gray-500 mb-1">
        {t('register.guide.confirmPassword')}
      </p>
      <div className="relative">

        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder={t('password.reenterPassword', 'Re-enter Password')}
          value={form.member_pwd_new}
          onChange={(e) => handleChange('member_pwd_new', e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-[16px]"
        />
        <img
          src={showConfirmPassword ? 'eye.svg' : 'eye-slash.svg'}
          alt="toggle visibility"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-3 w-5 h-5 cursor-pointer"
        />
      </div>

      {/* 이름 */}
      {/* <p className="text-xs text-gray-500">
        {t('personalInfo.passportNote', 'Must match the name on your passport.')}
      </p> */}

      <p className="text-xs text-gray-500 mb-1">
        {t('register.guide.firstName')}
      </p>
      <input
        placeholder={t('personalInfo.firstName', 'First name ( Given name)')}
        value={form.name_1st}
        onChange={(e) => handleChange('name_1st', e.target.value)}
        className="w-full border rounded-xl px-4 py-3 text-[16px]"
      />
      <p className="text-xs text-gray-500 mb-1">
        {t('register.guide.lastName')}
      </p>
      <input
        placeholder={t('personalInfo.lastName', 'Last name ( Family name)')}
        value={form.name_3rd}
        onChange={(e) => handleChange('name_3rd', e.target.value)}
        className="w-full border rounded-xl px-4 py-3 text-[16px]"
      />
    </div>

    {/* 생년월일 */}
    <div className="mt-6">
      <h2 className="text-[16px] font-semibold mb-2">
        {t('personalInfo.dob', 'Date of Birth')}
      </h2>
      <p className="text-xs text-gray-500 mb-1">
        {t('register.guide.dob')}
      </p>
      <div className="relative">
        <input
          type="date"
          value={form.birth}
          onChange={(e) => handleChange('birth', e.target.value)}
          placeholder={t('personalInfo.dob')}
          className="w-full border rounded-xl px-4 py-3 text-[16px] text-gray-600 appearance-none"
        />
        <img
          src="/calendar.svg"
          alt="calendar"
          className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
          />
      </div>
    </div>

      {/* 성별 선택 */}
      <div className="mt-6">
        <h2 className="text-[16px] font-semibold mb-2">
          {t('personalInfo.gender', 'Gender')}
        </h2>
        <div className="flex gap-2">
          {[
            { label: t('personalInfo.female', 'Female'), value: 'F' },
            { label: t('personalInfo.male', 'Male'), value: 'M' },
            { label: t('personalInfo.both', 'Other'), value: 'O' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className={clsx(
                'px-4 py-2 rounded-full border text-[16px] font-medium',
                form.gender === option.value
                  ? 'bg-[#1A2456] text-white'
                  : 'bg-white text-gray-600 border-gray-300'
              )}
              onClick={() => handleChange('gender', option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 연락처 */}
      <div className="mt-6">
        <h2 className="text-[16px] font-semibold mb-2">
          {t('personalInfo.phone', 'Contact Number')}
        </h2>

        {/* 국가 코드 */}
        <button
          type="button"
          onClick={() => setShowCodeModal(true)}
          className="w-full border rounded-xl px-4 py-3 text-[16px] text-left text-gray-600"
        >
          {form.national_code || t('personalInfo.dialCode', 'Country code')}
        </button>

        {/* 전화번호 */}
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={t('personalInfo.phone')}
          value={form.phone}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, '');
            handleChange('phone', onlyNumbers);
          }}
          className="w-full border rounded-xl px-4 py-3 text-[16px] mt-3"
        />
      </div>


           {/* 약관 동의 */}
      <div className="my-6 px-5">
        <h2 className="text-base font-bold mb-3">{t('terms.agreementTitle', 'Agreement to terms')}</h2>
        <div className="flex items-center justify-between rounded-xl py-3 cursor-pointer">
          <div className="flex items-center gap-3" onClick={() => setAgreeTerms(!agreeTerms)}>
            <img
              src={agreeTerms ? '/common/tick-circle-on.svg' : '/common/tick-circle.svg'}
              className={clsx('w-5 h-5 transition', agreeTerms ? 'filter-none' : 'grayscale')}
              alt="tick"
            />
            <span className="text-[16px] font-medium text-gray-800">
              {t('terms.agreementCheck2', 'I have read the below information and agree with the Terms of Use')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setModalContent('terms');
              setShowTerms(true);
            }}
          >
            <img src="/common/arrow-down.svg" className="w-[24px] h-[24px]" alt="arrow" />
          </button>
        </div>
      </div>
      {/* 개인정보 처리방침 보기 */}
      <div className="px-5 -mt-4 mb-6">
  <div className="flex items-center justify-between rounded-xl py-3 cursor-pointer">
    <div
      className="flex items-center gap-3"
      onClick={() => setAgreePrivacy(!agreePrivacy)}
    >
      <img
        src={agreePrivacy ? '/common/tick-circle-on.svg' : '/common/tick-circle.svg'}
        className="w-5 h-5 transition"
        alt="tick"
      />
      <span className="text-[16px] font-medium text-gray-800">
        {t('terms.privacyNotice', 'I have read and agree to the Privacy Policy')}
      </span>
    </div>
    <button
      type="button"
      onClick={() => {
        setModalContent('privacy');
        setShowTerms(true);
      }}
    >
      <img
        src="/common/arrow-down.svg"
        className="w-[24px] h-[24px]"
        alt="arrow"
      />
    </button>
  </div>
</div>
{/* 메일 광고 수신 동의 */}
<div className="px-5 -mt-4 mb-3">
<div
  className="flex items-center justify-between rounded-xl py-3 cursor-pointer"
  onClick={() => handleChange('MailYN', form.MailYN === 'Y' ? '' : 'Y')}
>
  <div className="flex items-center gap-3">
    <img
      src={form.MailYN === 'Y' ? '/common/tick-circle-on.svg' : '/common/tick-circle.svg'}
      className="w-5 h-5 transition"
      alt="tick"
    />
    <span className="text-[16px] font-medium text-gray-800">
      {t('terms.adAgree', 'I agree to receive promotional emails and marketing notifications')}
    </span>
  </div>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation(); // ✅ 체크 막고 모달 열기만
      setModalContent('ad'); // 'ad' 모달 보여주도록 구성 가능
      setShowTerms(true);
    }}
  >
    <img
      src="/common/arrow-down.svg"
      className="w-[24px] h-[24px]"
      alt="arrow"
    />
  </button>
</div>
</div>





      {/* 하단 고정 버튼 */}
      <div className="sticky bottom-0 left-0 right-0 px-5 py-4 bg-white border-t max-w-[430px] w-full m-auto">
        <button
          className="bg-[#FF8FA9] text-white rounded-xl py-3 font-semibold w-full"
          onClick={handleSubmit}
        >
          {t('loginEmail.signUp.sendBtn', 'Register')}
        </button>
      </div>

      {/* 모달 컴포넌트들 */}
      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        type={modalContent}
      />
      <AlertModal
        isOpen={alert.open}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        title={alert.title}
        description={alert.description}
        buttonText={alert.buttonText}
      />
      <CountrySelectModal
        isOpen={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        type="country"
        onSelect={(value) => handleChange('nationality', value)}
      />
      <CountrySelectModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        type="code"
        onSelect={(value) => handleChange('national_code', value)}
      />
   </div>
    </div>
  );
}