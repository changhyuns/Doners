import Input from 'assets/theme/Input/Input';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ApplyDetailForm.module.scss';
import ReceiptEditor from 'containers/EpilogueEditor/ReceiptEditor/ReceiptEditor';
import allow from 'assets/images/exchangearrow.png';
import Button from 'assets/theme/Button/Button';
import { postDonation } from 'services/api/Donation';

type historyType = {
  epilogueBudgetAmount: string;
  epilogueBudgetPlan: string;
  sequence: number;
};

const cx = classNames.bind(styles);
const ApplyDetailForm = ({ setApplyStep, apply, setApply }: any) => {
  const [historyList, setHistoryList] = useState<historyType[]>([]);
  const [ssf, setSSF] = useState(100);

  let total = historyList
    .map((item) => Number(item.epilogueBudgetAmount))
    .reduce((prev, curr) => prev + curr, 0);

  const handleUploadPlan = (data: any) => {
    setHistoryList((prev) => [...prev, data]);
    console.log(historyList);
  };

  const setValue = async () => {
    console.log(apply);
    const formData = new FormData();
    formData.append('certificate', apply.certificate);
    formData.append('muitipart', apply.image);
    formData.append('evidence', apply.evidence);

    let result = historyList
      .map(({ epilogueBudgetPlan: plan, epilogueBudgetAmount: amount }) => ({
        plan,
        amount,
      }))
      .map((data, idx) => ({ ...data, sequence: idx }));
    console.log(result);

    formData.append(
      'donationInfoRequestDTO',
      new Blob(
        [
          JSON.stringify({
            beneficiaryName: apply.beneficiaryName,
            beneficiaryPhone: apply.beneficiaryPhoney,
            categoryCode: apply.categoryCode,
            deputy: apply.deputy,
            description: apply.description,
            endTime: apply.endTime,
            budget: result,
            targetAmount: total,
            title: apply.title,
            phone: apply.phone,
          }),
        ],
        {
          type: 'application/json',
        }
      )
    );
    console.log(formData);
    const response = await postDonation(formData);
    console.log(response);
  };
  useEffect(() => {
    const ssftrans = total / 4000000;
    const temp1 = ssftrans * 10000;
    const temp2 = Math.ceil(temp1);
    const result = temp2 / 10000;
    setSSF(result);
    setApply({ ...apply, targetAmount: total });
    console.log(total);
    console.log(apply.targetAmount);
  }, [total]);

  useEffect(() => {
    setApply({ ...apply, budget: historyList });
  }, [historyList]);

  return (
    <div className={cx('containor')}>
      <div className={cx('title')}>지갑 주소 확인</div>
      <div className={cx('subtitle')}>
        모금액을 수령하실 지갑의 Account 주소입니다.
      </div>
      <Input placeholder="모금 신청자 계정 지갑 주소" />
      <div className={cx('maintitle')}>희망 기부 금액 설정</div>
      <div className={cx('title')}>모금액 활용계획</div>
      <div className={cx('editor')}>
        <ReceiptEditor onChange={handleUploadPlan} list={historyList} />
      </div>

      <div className={cx('title')}>목표 모금액</div>
      <div className={cx('goal')}>
        <div className={cx('trans')}>
          <Input
            placeholder="KRW"
            value={`${total.toLocaleString()} KRW`}
            disabled={true}
          />
        </div>
        <div className={cx('icon')}>
          <img src={allow} />
        </div>
        <div className={cx('trans')}>
          <Input placeholder={`SSF`} value={`${ssf} SSF`} disabled={true} />
        </div>
      </div>
      <div className={cx('nextbtn')}>
        {apply.budget !== '' ? (
          <Button color={'alternate'} onClick={setValue}>
            완료
          </Button>
        ) : (
          <Button color={'alternate'}>폼을 작성해주세요.</Button>
        )}
      </div>
    </div>
  );
};

export default ApplyDetailForm;
