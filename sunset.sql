-- phpMyAdmin SQL Dump
-- version 4.9.4
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Сен 18 2021 г., 14:45
-- Версия сервера: 10.3.13-MariaDB-log
-- Версия PHP: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `sunset`
--

-- --------------------------------------------------------

--
-- Структура таблицы `characters`
--

CREATE TABLE `characters` (
  `id` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `lastDate` datetime NOT NULL DEFAULT current_timestamp(),
  `userCreate` int(11) NOT NULL DEFAULT 0,
  `position` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cash` float NOT NULL DEFAULT 1200,
  `gender` int(11) NOT NULL DEFAULT 0,
  `skin` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `clothes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}',
  `charname` varchar(144) NOT NULL DEFAULT 'No Name',
  `dateBirth` datetime NOT NULL DEFAULT current_timestamp(),
  `keyBinds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `chatsettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `characters`
--

INSERT INTO `characters` (`id`, `userID`, `lastDate`, `userCreate`, `position`, `cash`, `gender`, `skin`, `clothes`, `charname`, `dateBirth`, `keyBinds`, `chatsettings`) VALUES
(7, 2, '2021-09-16 14:07:32', 1, '{\"x\":-722.7147216796875,\"y\":-647.6873168945312,\"z\":29.39592170715332,\"a\":56.591461181640625,\"vw\":0}', 1200, 1, '{\"pedigree\":{\"one\":38,\"two\":27,\"looks\":0.5,\"skin\":0.3},\"hair\":{\"color\":12,\"head\":2,\"eyebrow\":11,\"beard\":16,\"breast\":14},\"face\":[\"0.8\",\"0.2\",\"-1.0\",\"0.3\",\"0.6\",\"-0.1\",\"-0.0\",\"-0.9\",\"-0.5\",\"0.3\",\"0.1\",\"0.1\",\"-0.6\",\"-0.5\",\"-1.0\",\"-0.8\",\"-1.0\",\"-0.6\",\"-0.9\",\"-0.9\"],\"appearance\":[22.221322906312402,24.92626441260384,1.9182443020537554,8.75105134137559,1.8332220147546365,9.336684334487215,13.321276908494653,17.666831506447192,1.5545348852734353]}', '{\"mask\":0,\"torsos\":3,\"legs\":4,\"bags\":0,\"shoes\":0,\"accessories\":0,\"undershirts\":15,\"armour\":0,\"decals\":0,\"tops\":3,\"head\":0}', 'Nezuko Kamado', '2001-01-12 21:24:05', '{\"toggleVehicleEngine\":{\"name\":\"N\",\"key\":78},\"toggleVehicleLocked\":{\"name\":\"L\",\"key\":76},\"toggleVehicleBelt\":{\"name\":\"K\",\"key\":75}}', '{\"timestamp\":true}'),
(8, 3, '2021-09-14 23:11:56', 1, '{\"x\":131.40255737304688,\"y\":-1179.633544921875,\"z\":29.58236312866211,\"a\":-0.005313886795192957,\"vw\":1}', 1200, 0, '{\"pedigree\":{\"one\":33,\"two\":42,\"looks\":0.3,\"skin\":0.8},\"hair\":{\"color\":4,\"head\":21,\"eyebrow\":23,\"beard\":16,\"breast\":3},\"face\":[\"0.7\",\"0.6\",\"-0.5\",\"1.0\",\"0.5\",\"-0.1\",\"0.6\",\"0.5\",\"0.6\",\"0.4\",\"0.9\",\"0.3\",\"0.6\",\"-0.8\",\"1.0\",\"-0.7\",\"-0.3\",\"-0.6\",\"0.8\",\"-0.9\"],\"appearance\":[7.284942424710614,13.986114546710017,0.8197586834072379,7.0579662333818245,6.38792725015228,9.035136821778273,38.871125612556796,10.34508569247113,7.799726898470861]}', '{\"head\":0,\"mask\":0,\"torsos\":6,\"legs\":5,\"bags\":0,\"shoes\":4,\"accessories\":0,\"undershirts\":15,\"armour\":0,\"decals\":0,\"tops\":7}', 'Test Test', '2000-12-01 22:34:26', '{}', '{}');

-- --------------------------------------------------------

--
-- Структура таблицы `houses`
--

CREATE TABLE `houses` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `class` int(11) NOT NULL,
  `owner` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `position` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `interior` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `regDate` datetime DEFAULT current_timestamp(),
  `lastDate` datetime NOT NULL DEFAULT current_timestamp(),
  `regIP` varchar(16) NOT NULL,
  `lastIP` varchar(16) NOT NULL,
  `admin` int(11) NOT NULL DEFAULT 0,
  `adminData` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `regDate`, `lastDate`, `regIP`, `lastIP`, `admin`, `adminData`) VALUES
(2, 'MyAngelNezuko', '1444e0f8ad7f76adb90b9c07e9a09d5002d6161e015f4eecc2ffa694dc9a05e9', 'myangelnezuko@yandex.ru', '2021-09-14 21:12:03', '2021-09-16 14:07:32', '127.0.0.1', '127.0.0.1', 5, '{\"resetDate\":\"2021-09-15T07:57:16.901Z\",\"resetUsername\":\"MyAngelNezuko\",\"lastLevel\":5}'),
(3, 'Test', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'test@testemailnone.none', '2021-09-14 22:30:57', '2021-09-14 23:11:56', '127.0.0.1', '127.0.0.1', 0, '{}');

-- --------------------------------------------------------

--
-- Структура таблицы `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `model` varchar(255) NOT NULL,
  `position` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `heading` float NOT NULL,
  `owner` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `locked` int(11) NOT NULL,
  `number` varchar(144) NOT NULL,
  `color` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `mileage` float NOT NULL DEFAULT 0,
  `fuel` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `vehicles`
--

INSERT INTO `vehicles` (`id`, `model`, `position`, `heading`, `owner`, `locked`, `number`, `color`, `mileage`, `fuel`) VALUES
(6, 't20', '{\"x\":-517.3497924804688,\"y\":-668.698974609375,\"z\":33.0715446472168}', 0.493153, '{\"player\":7}', 0, 'NONE', '[[255,255,255],[255,255,255]]', 0, 40);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `houses`
--
ALTER TABLE `houses`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `houses`
--
ALTER TABLE `houses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
