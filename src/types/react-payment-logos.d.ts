declare module 'react-payment-logos' {
    import { FC } from 'react';

    export type PaymentLogoType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'diners' | 'unionpay';

    interface PaymentLogoProps {
        type: PaymentLogoType;
        style?: React.CSSProperties;
        className?: string;
    }

    const PaymentLogo: FC<PaymentLogoProps>;
    export default PaymentLogo;
} 