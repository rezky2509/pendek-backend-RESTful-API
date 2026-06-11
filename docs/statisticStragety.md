// ✅ FAST: Both writes happen at the exact same time
<!-- Atomic Parallel -->
await Promise.all([
    UrlMapper.updateOne({ _id: url_id }, { $inc: { total_clicks: 1 } }),
    Statistic.updateOne(
        { url_id }, 
        { 
            $inc: { 
                [`deviceType.${device}`]: 1, 
                [`regions.${country}`]: 1 
            } 
        }, 
        { upsert: true }
    )
]);

<!-- Remove total_clicks from url_mappers -->
export interface Statistic {
    url_id: ObjectId;
    total_clicks: number; // 👈 Moved here so you only do 1 write per click
    deviceType: {
        android: number;
        ios: number;
        macOS: number;
        windows: number;
        linux: number;
        other: number;
    };
    regions: Record<string, number>; // Key-value tracking: { "MY": 120, "SG": 45 }
}