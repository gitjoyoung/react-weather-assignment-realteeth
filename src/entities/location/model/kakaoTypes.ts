export interface KakaoAddress {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_3depth_h_name: string;
    h_code: string;
    b_code: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    x: string;
    y: string;
}

export interface KakaoRoadAddress {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
    x: string;
    y: string;
}

export interface KakaoAddressDocument {
    address_name: string;
    address_type: string;
    x: string;
    y: string;
    address: KakaoAddress;
    road_address: KakaoRoadAddress | null;
}

export interface KakaoRegionDocument {
    region_type: 'H' | 'B';
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_4depth_name: string;
    code: string;
    x: string;
    y: string;
}

export interface KakaoApiMeta {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
}

export interface KakaoApiResponse<T> {
    meta: KakaoApiMeta;
    documents: T[];
}
