'use client';

import { useEffect, useState } from 'react';
import TermsModal from './TermsModal';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface CancelPaymentModalProps {
  onClose: () => void;
  onSubmit: (
    reason: string,
    refundAmount: number,
    txn_id: string,
    type_seq: number | null,
    remark: string
  ) => void;
  res_day: string;
  res_seq: string;
  member_idx: number;
  currency: string;
  txn_id: string;
  type_seq: number | null;
  remark: string;
}

export default function CancelPaymentModal({
  onClose,
  onSubmit,
  res_day,
  res_seq,
  member_idx,
  currency,
  txn_id,
  type_seq,
  remark,
}: CancelPaymentModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [feeInfo, setFeeInfo] = useState<{
    amount: number;
    UserCancelPenalty: number;
    refund_amount: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [agreeCancel, setAgreeCancel] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [modalType, setModalType] = useState<'cancel' | 'terms'>('cancel');

  useEffect(() => {
    const fetchCancelFee = async () => {
      try {
        const res = await fetch('/api/toss/cancel-fee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ res_day, res_seq, member_idx }),
        });
        const data = await res.json();

        if (!data.success) {
          setErrorMsg(data.message || 'Unable to fetch cancellation info.');
        } else {
          setFeeInfo({
            amount: data.amount,
            UserCancelPenalty: data.UserCancelPenalty,
            refund_amount: data.refund_amount,
          });
        }
      } catch (err) {
        console.log(err);
        setErrorMsg('Server error while fetching fee info.');
      }
    };
    fetchCancelFee();
  }, [res_day, res_seq, member_idx]);

  const renderCurrency = (amount: number) => {
    if (currency === 'KRW') return `₩${Math.trunc(amount).toLocaleString()}`;
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[430px] shadow-xl">
        <h2 className="text-lg font-bold mb-4 text-[#FF4D4F]">{t('myBooking.cancel.cancelPayment', 'Cancel Payment')}</h2>

        {errorMsg ? (
          <p className="text-[16px] text-red-500 mb-4">{errorMsg}</p>
        ) : feeInfo ? (
          <div className="bg-[#FFF7F8] border border-[#FFCBD1] rounded-xl p-4 text-[16px] mb-5">
            <p className="mb-1">
              <span className="font-semibold">{t('myBooking.cancel.totalPayment', 'Total Payment')}:</span> {renderCurrency(feeInfo.amount)}
            </p>
            <p className="mb-1">
              <span className="font-semibold">{t('myBooking.cancel.cancelFee', 'Cancellation Fee')}:</span> {feeInfo.UserCancelPenalty}%
            </p>
            <p>
              <span className="font-semibold">{t('myBooking.cancel.refundAmount', 'Refund Amount')}:</span> {renderCurrency(feeInfo.refund_amount)}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {t('myBooking.cancel.cancelPolicy', '* A cancellation fee will be applied based on the policy. Please confirm before proceeding.')}
            </p>
          </div>
        ) : (
          <p className="text-[16px] text-gray-500 mb-4">{t('myBooking.cancel.loadCancelInformation', 'Loading cancellation information...')}</p>
        )}

        {/* Agreement Section */}
        <div className="my-6">
          <h2 className="text-base font-bold mb-3">{t('myBooking.cancel.agreeTerms', 'Agreement to terms')}</h2>

          {/* Cancellation Policy */}
          <div className="flex items-center justify-between rounded-xl py-3 cursor-pointer">
            <div
              className="flex items-center gap-3"
              onClick={() => setAgreeCancel(!agreeCancel)}
            >
              <img
                src={agreeCancel ? "/common/tick-circle-on.svg" : "/common/tick-circle.svg"}
                className={clsx('w-5 h-5 transition', agreeCancel ? 'filter-none' : 'grayscale')}
                alt="tick"
              />
              <span className="text-[16px] font-medium text-gray-800">
                {t('myBooking.cancel.reviewedCancelPolicy', 'I have reviewed and agree to the cancellation policy.')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalType('cancel');
                setShowTerms(true);
              }}
            >
              <img src="/common/arrow-down.svg" className="w-[24px] h-[24px]" alt="arrow" />
            </button>
          </div>

          {/* Terms of Use */}
          <div className="flex items-center justify-between rounded-xl py-3 cursor-pointer">
            <div
              className="flex items-center gap-3"
              onClick={() => setAgreeTerms(!agreeTerms)}
            >
              <img
                src={agreeTerms ? "/common/tick-circle-on.svg" : "/common/tick-circle.svg"}
                className={clsx('w-5 h-5 transition', agreeTerms ? 'filter-none' : 'grayscale')}
                alt="tick"
              />
              <span className="text-[16px] font-medium text-gray-800">
                {t('myBooking.cancel.readInformationAndAgreeToTerms', 'I have read the below information and agree with the Terms of Use')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalType('terms');
                setShowTerms(true);
              }}
            >
              <img src="/common/arrow-down.svg" className="w-[24px] h-[24px]" alt="arrow" />
            </button>
          </div>
        </div>

        <label className="block text-[16px] font-medium mb-2 text-gray-700">{t('myBooking.cancel.reasonForCancel', 'Reason for Cancellation')}</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t('myBooking.cancel.placefolderReason', 'Please tell us the reason for cancellation.')}
          className="w-full border border-gray-300 rounded-lg p-3 h-28 resize-none text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FF4D4F]"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
          >
            {t('common.close', 'close')}
          </button>
          <button
            onClick={() => onSubmit(reason, feeInfo?.refund_amount ?? 0, txn_id, type_seq, remark)}
            disabled={!reason || !feeInfo || !agreeCancel || !agreeTerms}
            className="px-5 py-2 rounded-lg bg-[#FF4D4F] text-white font-semibold hover:bg-[#e64547] transition disabled:opacity-50"
          >
            {t('common.submit', 'Submit')}
          </button>
        </div>
      </div>

      {/* Terms Modal */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} type={modalType} />
    </div>
  );
}
