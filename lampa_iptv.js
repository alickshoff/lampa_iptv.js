(function () {
    'use strict';

    function startPlugin() {
        if (window.my_ultimate_plugin) return;
        window.my_ultimate_plugin = true;
        
        console.log('✅ Современный плагин загружен!');

        // --- IPTV с реальными ссылками ---
        if (Lampa.Plugins.iptv) {
            Lampa.Storage.set('iptv_enable', true);
            
            // Основной источник (Zabava Full)
            Lampa.Source.add('iptv_zabava', {
                title: '📺 Россия 24/7 (Zabava)',
                source: 'iptv',
                url: 'https://raw.githubusercontent.com/CrocoUser/zabava-project/refs/heads/main/zabava-full.m3u',
                epg: 'https://epg.one/epg.xml.gz',  // ← программа передач
                adult: false
            });
            
            // Доп. источник (Международный)
            Lampa.Source.add('iptv_world', {
                title: '🌍 Мировые каналы (IPTV-org)',
                source: 'iptv',
                url: 'https://iptv-org.github.io/iptv/index.m3u',
                epg: 'https://epg.one/epg.xml.gz',
                adult: false
            });
            
            console.log('📺 IPTV модуль активирован');
        }

        // --- Клубничка (если нужна) ---
        Lampa.SettingsApi.addParam({
            component: 'main',
            param: {
                name: 'adult_content',
                type: 'trigger',
                default: false
            },
            field: {
                name: '🔞 Показывать клубничку',
                description: 'Включить отображение каналов 18+ в IPTV'
            },
            onChange: function (value) {
                Lampa.Storage.set('adult_enabled', value === 'true');
                Lampa.Listener.send('iptv', { type: 'reload' });
            }
        });

        // --- Для фильмов и сериалов ---
        if (Lampa.Manifest.app_digital >= 300) {
            Lampa.Source.add('online_custom', {
                title: '🎬 Кино и Сериалы',
                source: 'online',
                url: 'https://lampac.org/api/vod.json',
                proxy: true
            });
        }

        // --- Настройка плеера ---
        Lampa.Storage.set('player_hardware', true);
        Lampa.Storage.set('player_background', 'dark');
        
        console.log('🎮 Современный плеер настроен');
    }

    // --- Запуск плагина ---
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }
})();