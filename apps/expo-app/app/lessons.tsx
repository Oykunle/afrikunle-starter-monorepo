import { useEffect, useState, useContext } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { API_BASE_URL } from '../src/config';
import { LocaleContext } from './_layout';
import { t } from '../src/i18n';

export default function Lessons() {
  const [lessons, setLessons] = useState<any[]>([]);
  const { locale } = useContext(LocaleContext);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/lessons`)
      .then(r => r.json())
      .then(setLessons)
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => String(item.id)}
        renderItem={({item}) => (
          <Link href={`/lesson/${item.id}`} style={styles.item}>
            {item.title[locale] || item.title['en']}
          </Link>
        )}
      />
      <Link href="/" style={styles.back}>← Back</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  item: { padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8, marginVertical: 6 },
  back: { marginTop: 12 }
});
