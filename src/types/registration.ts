export interface spectatorRegistrationRequest {
    is_athlete: boolean;
    event_id: number;
    quantity: number;
    courtesy_code: string;

    full_name: string;
    email: string;
    phone_number: string;

    client_first_name: string;
    client_last_name: string;
    client_phone: string;
    client_email: string;
    client_country: string;
    client_city: string;
    client_state: string;
    client_postal_code: string;
    client_location: string;

    card_name: string;
    expiration_month: string;
    expiration_year: string;
    card_number: string;
    cvv: string;

    simulate: boolean;
}

export interface individualRegistrationRequest {
    is_athlete: boolean;
    event_id: number;
    courtesy_code: string;
    tshirt_size: string;
    gender: string;

    full_name: string;
    email: string;
    phone_number: string;

    client_first_name: string;
    client_last_name: string;
    client_phone: string;
    client_email: string;
    client_country: string;
    client_city: string;
    client_state: string;
    client_postal_code: string;
    client_location: string;

    card_name: string;
    expiration_month: string;
    expiration_year: string;
    card_number: string;
    cvv: string;

    simulate: boolean;
}

export interface groupRegistrationRequest {
    is_athlete: boolean;
    event_id: number;
    quantity: number;
    courtesy_code: string;

    full_name: string;
    email: string;
    phone_number: string;

    client_first_name: string;
    client_last_name: string;
    client_phone: string;
    client_email: string;
    client_country: string;
    client_city: string;
    client_state: string;
    client_postal_code: string;
    client_location: string;

    card_name: string;
    expiration_month: string;
    expiration_year: string;
    card_number: string;
    cvv: string;

    simulate: boolean;
} 