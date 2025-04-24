declare module '@systeminfected/react-payment-icons' {
    import { FC } from 'react';

    export type PaymentIconType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'diners' | 'unionpay';

    interface PaymentIconProps {
        type: PaymentIconType;
        style?: React.CSSProperties;
        className?: string;
    }

    export const Icon: FC<PaymentIconProps>;
} 