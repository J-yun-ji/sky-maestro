import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import styles from "../../styles/cretateAccount/CreateAccount.module.css";
import { createAccount } from "./createAccountFnc/CreateAccountAction"; // 액션 파일 임포트

interface FormData {
    userName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmpassword: string;
}

const CreateAccount: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
    const [message, setMessage] = useState<string | null>(null); // 메시지 상태 추가
    const [showModal, setShowModal] = useState<boolean>(false); // 모달 상태 추가
    const navigate = useNavigate(); // useNavigate 훅 추가

    const onSubmit = async (data: FormData) => {
        try {
            const { confirmpassword, ...rest } = data; // confirmpassword 필드를 제외한 나머지 데이터만 사용
            const response = await createAccount(rest); // 서버로 전송
            setMessage(response.message); // 성공 시 메시지 설정
            setShowModal(true); // 모달 표시
        } catch (error) {
            console.error('Failed to create account', error);
            setMessage('계정 생성에 실패했습니다. 다시 시도해 주세요.'); // 에러 메시지 설정
        }
    };

    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const passwordPattern = /^[A-Za-z\d@$!%*#?&]{4,}$/; // 패턴 수정: 알파벳 대소문자, 숫자, 특수문자를 포함한 4자 이상
    const phonePattern = /^\d{10,11}$/; // 10자리 또는 11자리 숫자

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/login'); // 로그인 페이지로 이동
    };

    return (
        <>
            <Header centerContent="회원가입" />
            <div className={styles.createAccountContainer}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        {...register('userName', { required: true, minLength: 2, maxLength: 10 })}
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                    />
                    {errors.userName && <p className={styles.error}>사용자 이름은 필수이며 2자 이상 10자 이하여야 합니다.</p>}

                    <input
                        {...register('email', { required: true, pattern: emailPattern })}
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                    />
                    {errors.email && <p className={styles.error}>올바른 이메일 주소가 아닙니다.</p>}

                    <input
                        {...register('phoneNumber', { required: true, pattern: phonePattern })}
                        type="tel"
                        placeholder="Phone Number"
                        autoComplete="tel"
                    />
                    {errors.phoneNumber && <p className={styles.error}>올바른 전화번호가 아닙니다. 10자리 또는 11자리 숫자를 입력하세요.</p>}

                    <input
                        {...register('password', { required: true, minLength: 4, pattern: passwordPattern })}
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                    />
                    {errors.password && <p className={styles.error}>비밀번호는 필수이며 4자 이상이어야 합니다.</p>}

                    <input
                        {...register('confirmpassword', {
                            required: true,
                            minLength: 4,
                            validate: (value) => value === watch('password') || "Passwords do not match"
                        })}
                        type="password"
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                    />
                    {errors.confirmpassword && <p className={styles.error}>비밀번호가 일치하지 않습니다.</p>}

                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.button}>계정 생성</button>
                    </div>
                </form>
                {message && <p className={styles.message}>{message}</p>} {/* 메시지 표시 */}
            </div>
            {showModal && <Modal message={message!} onClose={handleCloseModal} />} {/* 모달 표시 */}
        </>
    );
}

export default CreateAccount;
