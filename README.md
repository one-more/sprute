# Sprute.js
Изоморфный фреймворк, реализующий единую архитектуру для клиентской и серверной части приложения.
Кодовая база является единой для клиента и сервера, что позволяет писать код один раз. 
На клиенте приложение является Single Page Application

## Установка:
* Скачайте и распакуйте [последнюю версию фреймворка](https://github.com/one-more/sprute/releases/latest)
* Установите зависимости
```bash
npm install & bower install
```
* Для сборки статики потребуется gulp
```bash
npm install -g gulp
```
* Запустите проект 
```node
node index
```
Проект будет доступен по ссылке [http://localhost:3000](http://localhost:3000/) 

## Документация
(https://github.com/one-more/sprute/wiki)

## Структура проекта
````
./back # код специфичный для сервера
./configuration # файлы конфигурации
./common # изоморфный код
./front # код специфичный для клиента
./static # директория со статикой
./themes # директория с темами
````

## С чего начать
* [Маршрутизация](https://github.com/one-more/sprute/wiki/%D0%9C%D0%B0%D1%80%D1%88%D1%80%D1%83%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F)
* [Рендеринг страниц](https://github.com/one-more/sprute/wiki/%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80-%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%B0-View)
* [Темы](https://github.com/one-more/sprute/wiki/%D0%A2%D0%B5%D0%BC%D1%8B)
* [Работа с данными](https://github.com/one-more/sprute/wiki/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0-%D1%81-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8)
* [Файлы конфигурации](https://github.com/one-more/sprute/wiki/%D0%9A%D0%BE%D0%BD%D1%84%D0%B8%D0%B3%D1%83%D1%80%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5-%D1%84%D0%B0%D0%B9%D0%BB%D1%8B)
* [Сборка статики](https://github.com/one-more/sprute/wiki/%D0%A1%D0%B1%D0%BE%D1%80%D0%BA%D0%B0-%D1%81%D1%82%D0%B0%D1%82%D0%B8%D0%BA%D0%B8)

## Помощь проекту
Репорт багов, предложения а так же pull реквесты приветствуются
