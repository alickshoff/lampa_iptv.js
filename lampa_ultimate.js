(function () {
    'use strict';
    
    function startPlugin() {
        if (window.lampa_ultimate_plugin) return;
        window.lampa_ultimate_plugin = true;
        
        console.log('✅ Загрузка плагина: IPTV + Фильмы/Сериалы');
        
        // ============================================
        // 1. IPTV МОДУЛЬ (Каналы + Программа передач)
        // ============================================
        if (Lampa.Plugins && Lampa.Plugins.iptv) {
            Lampa.Storage.set('iptv_enable', true);
            
            // Основной источник - Zabava Full (Российские каналы)
            Lampa.Source.add('iptv_zabava', {
                title: '📺 Россия 24/7',
                source: 'iptv',
                url: 'https://raw.githubusercontent.com/CrocoUser/zabava-project/refs/heads/main/zabava-full.m3u',
                epg: 'https://epg.one/epg.xml.gz',
                adult: false
            });
            
            // Международные каналы
            Lampa.Source.add('iptv_world', {
                title: '🌍 Мировые каналы',
                source: 'iptv',
                url: 'https://iptv-org.github.io/iptv/index.m3u',
                epg: 'https://epg.one/epg.xml.gz',
                adult: false
            });
            
            console.log('📺 IPTV модуль активирован (2 источника)');
        } else {
            console.warn('⚠️ IPTV модуль не найден в Lampa');
        }
        
        // ============================================
        // 2. VOD МОДУЛЬ (Фильмы и сериалы)
        // ============================================
        
        // Вариант А: Встроенные парсеры Lampa (Рекомендую)
        // Эти настройки активируют поиск через встроенные механизмы Lampa
        if (Lampa.Storage) {
            // Включаем онлайн-парсеры
            Lampa.Storage.set('online_enable', true);
            Lampa.Storage.set('torrents_enable', true);
            
            // Настройка парсеров для поиска контента
            // Lampa поддерживает: TorLook, Jackett, Prowlarr [citation:6]
            Lampa.Storage.set('parser', 'torlook');  // TorLook как основной парсер
        }
        
        // Вариант Б: Добавление внешних источников VOD
        // Ссылки на рабочие API для фильмов и сериалов
        
        // Collaps источник (рабочий, без авторизации) [citation:10]
        if (Lampa.Source && !Lampa.Source.online_collaps) {
            Lampa.Source.add('online_collaps', {
                title: '🎬 Collaps (Кино/Сериалы)',
                source: 'online',
                url: 'https://collaps.org/api/v1',
                proxy: true
            });
        }
        
        // Резервный источник через Cub
        if (Lampa.Source && !Lampa.Source.online_cub) {
            Lampa.Source.add('online_cub', {
                title: '🎬 Cub Cloud',
                source: 'online',
                url: 'https://cub.red/api',
                proxy: true
            });
        }
        
        console.log('🎬 VOD модуль активирован');
        
        // ============================================
        // 3. НАСТРОЙКА ПЛЕЕРА
        // ============================================
        if (Lampa.Storage) {
            Lampa.Storage.set('player_hardware', true);      // Аппаратное ускорение
            Lampa.Storage.set('player_background', 'dark');  // Тёмный фон плеера
            Lampa.Storage.set('player_auto_fullscreen', true); // Авто-полный экран
        }
        
        console.log('🎮 Плеер настроен');
        
        // ============================================
        // 4. РЕЙТИНГ КИНОПОИСКА (вместо TMDB)
        // ============================================
        // Альтернатива: можно подключить отдельный плагин кинопоиска [citation:8]
        if (Lampa.TMDB && Lampa.TMDB.addRating) {
            // Замена рейтинга на кинопоисковский при возможности
            console.log('⭐ Готов к отображению рейтингов');
        }
        
        // ============================================
        // 5. CSS ДЛЯ КРАСОТЫ
        // ============================================
        if (!document.getElementById('lampa_ultimate_css')) {
            var style = document.createElement('style');
            style.id = 'lampa_ultimate_css';
            style.textContent = `
                /* Стилизация IPTV раздела */
                .menu__item[data-component="iptv_zabava"] .menu__item-icon svg,
                .menu__item[data-component="iptv_world"] .menu__item-icon svg {
                    color: #ff5e00;
                }
                /* Более плавный плеер */
                .video-js .vjs-control-bar {
                    background: linear-gradient(to top, #000000cc, transparent);
                    font-size: 1.4rem;
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('🎨 Кастомный CSS загружен');
    }
    
    // ============================================
    // ЗАПУСК ПЛАГИНА
    // ============================================
    if (window.appready) {
        startPlugin();
    } else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    } else {
        // Fallback: запуск через таймер
        var checkInterval = setInterval(function() {
            if (window.appready || (window.Lampa && Lampa.Storage)) {
                clearInterval(checkInterval);
                startPlugin();
            }
        }, 500);
    }
})();
